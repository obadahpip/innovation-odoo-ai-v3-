/**
 * Sales seed data — 10 orders in mixed states
 */
const D = (daysAgo, fmt='iso') => {
  const d = new Date(Date.now() - daysAgo * 86400000)
  return fmt === 'iso' ? d.toISOString() : d.toISOString().slice(0,10)
}

export default [
  {
    id:'sale-001', name:'REF/2025/0001', state:'sale',
    partner_id:'partner-acme', partner_name:'Acme Corp',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(45), confirmation_date: D(44),
    amount_untaxed:12500, amount_tax:2125, amount_total:14625,
    currency_id:'USD', note:'',
    order_line:[
      { id:'sol-001a', product_id:'prod-001', product_name:'ERP Base License', qty:1, price_unit:10000, price_subtotal:10000 },
      { id:'sol-001b', product_id:'prod-002', product_name:'Implementation Hours', qty:25, price_unit:100, price_subtotal:2500 },
    ],
  },
  {
    id:'sale-002', name:'REF/2025/0002', state:'sale',
    partner_id:'partner-delta', partner_name:'Delta Technologies',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(38), confirmation_date: D(37),
    amount_untaxed:8400, amount_tax:1428, amount_total:9828,
    currency_id:'USD',
    order_line:[
      { id:'sol-002a', product_id:'prod-003', product_name:'Annual Support', qty:1, price_unit:6000, price_subtotal:6000 },
      { id:'sol-002b', product_id:'prod-002', product_name:'Implementation Hours', qty:24, price_unit:100, price_subtotal:2400 },
    ],
  },
  {
    id:'sale-003', name:'REF/2025/0003', state:'sale',
    partner_id:'partner-global', partner_name:'Global Imports LLC',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(30), confirmation_date: D(29),
    amount_untaxed:5750, amount_tax:977.50, amount_total:6727.50,
    currency_id:'USD',
    order_line:[
      { id:'sol-003a', product_id:'prod-001', product_name:'ERP Base License', qty:1, price_unit:5000, price_subtotal:5000 },
      { id:'sol-003b', product_id:'prod-004', product_name:'Training Session', qty:5, price_unit:150, price_subtotal:750 },
    ],
  },
  {
    id:'sale-004', name:'REF/2025/0004', state:'draft',
    partner_id:'partner-nexus', partner_name:'Nexus Solutions',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(5),
    amount_untaxed:22000, amount_tax:3740, amount_total:25740,
    currency_id:'USD',
    order_line:[
      { id:'sol-004a', product_id:'prod-005', product_name:'Custom Development', qty:80, price_unit:250, price_subtotal:20000 },
      { id:'sol-004b', product_id:'prod-003', product_name:'Annual Support', qty:1, price_unit:2000, price_subtotal:2000 },
    ],
  },
  {
    id:'sale-005', name:'REF/2025/0005', state:'sent',
    partner_id:'partner-horizon', partner_name:'Horizon Ventures',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(8),
    amount_untaxed:9300, amount_tax:1581, amount_total:10881,
    currency_id:'USD',
    order_line:[
      { id:'sol-005a', product_id:'prod-001', product_name:'ERP Base License', qty:1, price_unit:8000, price_subtotal:8000 },
      { id:'sol-005b', product_id:'prod-004', product_name:'Training Session', qty:8, price_unit:162.50, price_subtotal:1300 },
    ],
  },
  {
    id:'sale-006', name:'REF/2025/0006', state:'sale',
    partner_id:'partner-solar', partner_name:'Solar Energy Co',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(22), confirmation_date: D(21),
    amount_untaxed:4200, amount_tax:714, amount_total:4914,
    currency_id:'USD',
    order_line:[
      { id:'sol-006a', product_id:'prod-003', product_name:'Annual Support', qty:1, price_unit:4200, price_subtotal:4200 },
    ],
  },
  {
    id:'sale-007', name:'REF/2025/0007', state:'draft',
    partner_id:'partner-apex', partner_name:'Apex Industries',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(2),
    amount_untaxed:16800, amount_tax:2856, amount_total:19656,
    currency_id:'USD',
    order_line:[
      { id:'sol-007a', product_id:'prod-005', product_name:'Custom Development', qty:60, price_unit:250, price_subtotal:15000 },
      { id:'sol-007b', product_id:'prod-002', product_name:'Implementation Hours', qty:18, price_unit:100, price_subtotal:1800 },
    ],
  },
  {
    id:'sale-008', name:'REF/2025/0008', state:'cancel',
    partner_id:'partner-nordic', partner_name:'Nordic Supplies AB',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(60), confirmation_date: D(59),
    amount_untaxed:3500, amount_tax:595, amount_total:4095,
    currency_id:'USD',
    order_line:[
      { id:'sol-008a', product_id:'prod-004', product_name:'Training Session', qty:20, price_unit:150, price_subtotal:3000 },
      { id:'sol-008b', product_id:'prod-002', product_name:'Implementation Hours', qty:5, price_unit:100, price_subtotal:500 },
    ],
  },
  {
    id:'sale-009', name:'REF/2025/0009', state:'sale',
    partner_id:'partner-raj', partner_name:'Raj Patel',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(15), confirmation_date: D(14),
    amount_untaxed:7600, amount_tax:1292, amount_total:8892,
    currency_id:'USD',
    order_line:[
      { id:'sol-009a', product_id:'prod-001', product_name:'ERP Base License', qty:1, price_unit:6500, price_subtotal:6500 },
      { id:'sol-009b', product_id:'prod-004', product_name:'Training Session', qty:7, price_unit:157.14, price_subtotal:1100 },
    ],
  },
  {
    id:'sale-010', name:'REF/2025/0010', state:'sent',
    partner_id:'partner-alice', partner_name:'Alice Fontaine',
    user_id:'user-admin', user_name:'Admin',
    date_order: D(3),
    amount_untaxed:11200, amount_tax:1904, amount_total:13104,
    currency_id:'USD',
    order_line:[
      { id:'sol-010a', product_id:'prod-005', product_name:'Custom Development', qty:40, price_unit:250, price_subtotal:10000 },
      { id:'sol-010b', product_id:'prod-002', product_name:'Implementation Hours', qty:12, price_unit:100, price_subtotal:1200 },
    ],
  },
]
