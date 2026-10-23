import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'data', 'db');
const PORT = process.env.PORT || 4000;

// Helper: Read JSON from data/db
async function readDb(file, defaultValue = []) {
  try {
    const raw = await fs.readFile(path.join(DB_DIR, file), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
}

// Helper: Write JSON to data/db
async function writeDb(file, data) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const p = path.join(DB_DIR, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper: Parse request JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: Send JSON response with CORS
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // 1. Health / Root
    if (pathname === '/' || pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'DAGDI Electricals Industrial Backend Service',
        location: 'Beawar, Rajasthan, India',
        gstin: '08ADOPD4068J1Z9',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: [
          '/health',
          '/api/products',
          '/api/orders',
          '/api/rfq',
          '/api/rewinding',
          '/api/calculator/apfc',
          '/api/advisor',
          '/api/admin/stats',
          '/api/config',
          '/api/contact'
        ]
      });
    }

    // 2. Products API
    if (pathname === '/api/products') {
      if (method === 'GET') {
        let products = await readDb('products.json', []);
        const search = parsedUrl.searchParams.get('search');
        const category = parsedUrl.searchParams.get('category');
        const brand = parsedUrl.searchParams.get('brand');
        const featured = parsedUrl.searchParams.get('featured');

        if (search) {
          const q = search.toLowerCase();
          products = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.partNumber.toLowerCase().includes(q)
          );
        }
        if (category && category !== 'all') {
          products = products.filter(p => p.category === category);
        }
        if (brand && brand !== 'all') {
          products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
        }
        if (featured === 'true') {
          products = products.filter(p => p.featured);
        }

        return sendJson(res, 200, {
          success: true,
          count: products.length,
          data: products
        });
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        const products = await readDb('products.json', []);
        const newProduct = {
          id: `dag-${Date.now().toString(36)}`,
          ...body,
          createdAt: new Date().toISOString()
        };
        products.unshift(newProduct);
        await writeDb('products.json', products);
        return sendJson(res, 201, { success: true, data: newProduct });
      }
    }

    // Single Product (/api/products/:id)
    if (pathname.startsWith('/api/products/')) {
      const id = decodeURIComponent(pathname.replace('/api/products/', ''));
      const products = await readDb('products.json', []);
      const index = products.findIndex(p => p.id === id || p.slug === id);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: 'Product not found' });
      }

      if (method === 'GET') {
        return sendJson(res, 200, { success: true, data: products[index] });
      }

      if (method === 'PUT' || method === 'PATCH') {
        const body = await parseBody(req);
        products[index] = { ...products[index], ...body, updatedAt: new Date().toISOString() };
        await writeDb('products.json', products);
        return sendJson(res, 200, { success: true, data: products[index] });
      }

      if (method === 'DELETE') {
        const removed = products.splice(index, 1);
        await writeDb('products.json', products);
        return sendJson(res, 200, { success: true, message: 'Product deleted', data: removed[0] });
      }
    }

    // 3. Orders API
    if (pathname === '/api/orders') {
      if (method === 'GET') {
        const orders = await readDb('orders.json', []);
        return sendJson(res, 200, { success: true, count: orders.length, data: orders });
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        const orders = await readDb('orders.json', []);
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
        const newOrder = {
          id: `ord_${Date.now()}`,
          orderNumber,
          customerName: body.customerName || 'Direct Customer',
          companyName: body.companyName || '',
          phone: body.phone || '',
          email: body.email || '',
          gstin: body.gstin || '',
          address: body.address || '',
          city: body.city || 'Beawar',
          pincode: body.pincode || '305901',
          items: body.items || [],
          subtotal: body.subtotal || 0,
          gstAmount: body.gstAmount || 0,
          total: body.total || 0,
          status: 'PENDING_APPROVAL',
          paymentMethod: body.paymentMethod || 'NEFT_RTGS',
          createdAt: new Date().toISOString()
        };
        orders.unshift(newOrder);
        await writeDb('orders.json', orders);
        return sendJson(res, 201, { success: true, data: newOrder });
      }
    }

    // Single Order (/api/orders/:id)
    if (pathname.startsWith('/api/orders/')) {
      const id = decodeURIComponent(pathname.replace('/api/orders/', ''));
      const orders = await readDb('orders.json', []);
      const index = orders.findIndex(o => o.id === id || o.orderNumber === id);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: 'Order not found' });
      }

      if (method === 'GET') {
        return sendJson(res, 200, { success: true, data: orders[index] });
      }

      if (method === 'PATCH' || method === 'PUT') {
        const body = await parseBody(req);
        orders[index] = { ...orders[index], ...body, updatedAt: new Date().toISOString() };
        await writeDb('orders.json', orders);
        return sendJson(res, 200, { success: true, data: orders[index] });
      }
    }

    // 4. RFQ / Quotation Requests
    if (pathname === '/api/rfq') {
      if (method === 'GET') {
        const rfqs = await readDb('quotations.json', []);
        return sendJson(res, 200, { success: true, count: rfqs.length, data: rfqs });
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        const rfqs = await readDb('quotations.json', []);
        const rfqNumber = `RFQ-${Date.now().toString().slice(-6)}`;
        const newRfq = {
          id: `rfq_${Date.now()}`,
          rfqNumber,
          customerName: body.customerName || '',
          companyName: body.companyName || '',
          phone: body.phone || '',
          email: body.email || '',
          gstin: body.gstin || '',
          city: body.city || '',
          notes: body.notes || '',
          items: body.items || [],
          status: 'PENDING_REVIEW',
          createdAt: new Date().toISOString()
        };
        rfqs.unshift(newRfq);
        await writeDb('quotations.json', rfqs);
        return sendJson(res, 201, { success: true, data: newRfq });
      }
    }

    // 5. Motor Rewinding Booking
    if (pathname === '/api/rewinding') {
      if (method === 'GET') {
        const rewindings = await readDb('rewindings.json', []);
        return sendJson(res, 200, { success: true, count: rewindings.length, data: rewindings });
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        const rewindings = await readDb('rewindings.json', []);
        const bookingNumber = `REW-${Date.now().toString().slice(-5)}`;
        const newBooking = {
          id: `rew_${Date.now()}`,
          bookingNumber,
          customerName: body.customerName || '',
          phone: body.phone || '',
          plantLocation: body.plantLocation || '',
          motorHp: body.motorHp || '50 HP',
          motorRpm: body.motorRpm || '1440 RPM',
          failureSymptoms: body.failureSymptoms || '',
          serviceRequired: body.serviceRequired || 'Complete Stator Rewind',
          estimatedDispatchDays: 3,
          status: 'BOOKED_AWAITING_DROP',
          createdAt: new Date().toISOString()
        };
        rewindings.unshift(newBooking);
        await writeDb('rewindings.json', rewindings);
        return sendJson(res, 201, { success: true, data: newBooking });
      }
    }

    // 6. APFC Engineering Calculator Endpoint
    if (pathname === '/api/calculator/apfc' && method === 'POST') {
      const body = await parseBody(req);
      const loadHp = parseFloat(body.loadHp || body.loadKw ? (body.loadKw / 0.746) : 100);
      const powerKw = body.loadKw ? parseFloat(body.loadKw) : (loadHp * 0.746);
      const initialPf = parseFloat(body.initialPf || 0.74);
      const targetPf = parseFloat(body.targetPf || 0.98);

      const theta1 = Math.acos(initialPf);
      const theta2 = Math.acos(targetPf);
      const rawKvar = powerKw * (Math.tan(theta1) - Math.tan(theta2));
      const recommendedKvar = Math.max(10, Math.ceil(rawKvar / 5) * 5);

      const currentKva = powerKw / initialPf;
      const improvedKva = powerKw / targetPf;
      const kvaSaved = Math.round(currentKva - improvedKva);
      const monthlySavingsInr = Math.round(kvaSaved * 380 + (powerKw * 8 * 25 * 0.45));

      return sendJson(res, 200, {
        success: true,
        data: {
          loadHp: Math.round(loadHp),
          powerKw: Math.round(powerKw * 10) / 10,
          initialPf,
          targetPf,
          recommendedKvar,
          kvaDemandReduction: kvaSaved,
          estimatedMonthlySavingsInr: monthlySavingsInr,
          recommendedSteps: recommendedKvar <= 50 ? '4-Step (10, 10, 15, 15 kVAR)' : '8-Step (10, 15, 25, 25, 25 kVAR)',
          relayRecommendation: 'Multispan or Entes Intelligent Microprocessor Relay'
        }
      });
    }

    // 7. AI Industrial Technical Advisor Endpoint
    if (pathname === '/api/advisor' && method === 'POST') {
      const body = await parseBody(req);
      const query = (body.query || body.message || '').toLowerCase();

      let answer = '';
      if (query.includes('e7018') || query.includes('welding') || query.includes('electrode')) {
        answer = 'Ador Advani Oerlikon E7018 (Supertherme) is an AWS A5.1 low-hydrogen iron-powder electrode designed for crack-sensitive heavy steel fabrication, stone crushers, and pressure vessels. Ensure electrodes are redried at 300°C for 1 hour before radiographic welding.';
      } else if (query.includes('apfc') || query.includes('capacitor') || query.includes('power factor') || query.includes('kvar')) {
        answer = 'To eliminate DISCOM low power factor penalty, install a microprocessor-controlled APFC panel with heavy-duty MPP capacitors. For inductive motor loads, each 100 HP requires approximately 45–55 kVAR compensation to maintain 0.98–0.99 lag.';
      } else if (query.includes('copper') || query.includes('wire') || query.includes('rewind')) {
        answer = 'Dagdi Electricals exclusively winds motors with Milan 99.99% ETP electrolytic dual-coated copper wire (Class H, 200°C thermal endurance), Class H Nomex slot insulation, and vacuum varnish baking for stone crusher quarry environments.';
      } else {
        answer = 'Welcome to Dagdi Electricals Technical Desk (Beawar, Rajasthan). We stock certified Ador & D&H Welding Electrodes, custom APFC Panels, Milan Copper Wires, and provide heavy 3-phase motor rewinding. You can request a quote or call Sandesh Dagdi Saini at +91 94142 81395.';
      }

      return sendJson(res, 200, {
        success: true,
        data: {
          query: body.query || body.message,
          answer,
          expertContact: '+91 94142 81395',
          timestamp: new Date().toISOString()
        }
      });
    }

    // 8. Admin Statistics API
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const products = await readDb('products.json', []);
      const orders = await readDb('orders.json', []);
      const rfqs = await readDb('quotations.json', []);
      const rewindings = await readDb('rewindings.json', []);

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 10)), 0);

      return sendJson(res, 200, {
        success: true,
        data: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRfqs: rfqs.length,
          totalRewindings: rewindings.length,
          totalRevenueInr: totalRevenue,
          totalInventoryValueInr: totalInventoryValue,
          activePincodeRegion: 'Rajasthan - Beawar, Ajmer, Jaipur, Jodhpur'
        }
      });
    }

    // 9. Store Config API
    if (pathname === '/api/config') {
      if (method === 'GET') {
        const config = await readDb('config.json', {
          storeName: 'DAGDI Electricals',
          gstin: '08ADOPD4068J1Z9',
          owner: 'Sandesh Dagdi Saini',
          phone1: '+91 94142 81395',
          phone2: '+91 98291 54723',
          address: 'Chhawani Road, Opp. Industrial Area, Beawar - 305901, Rajasthan',
          city: 'Beawar'
        });
        return sendJson(res, 200, { success: true, data: config });
      }

      if (method === 'POST' || method === 'PUT') {
        const body = await parseBody(req);
        const existing = await readDb('config.json', {});
        const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
        await writeDb('config.json', updated);
        return sendJson(res, 200, { success: true, data: updated });
      }
    }

    // 10. Contact / Inquiry Form
    if (pathname === '/api/contact' && method === 'POST') {
      const body = await parseBody(req);
      return sendJson(res, 200, {
        success: true,
        message: 'Inquiry received by Dagdi Electricals Beawar desk. Our team will contact you shortly.',
        data: body
      });
    }

    // 404 Catch-all
    return sendJson(res, 404, { success: false, error: 'Endpoint not found', path: pathname });

  } catch (err) {
    console.error('Server error:', err);
    return sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ DAGDI Electricals API Service running on port ${PORT}`);
  console.log(`🌐 Health check at http://0.0.0.0:${PORT}/health`);
});
