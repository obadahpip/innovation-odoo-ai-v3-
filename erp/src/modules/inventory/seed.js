/**
 * Inventory seed data — products, warehouses, locations, quants
 */

export const WAREHOUSES = [
  { id:'wh-main',  name:'Main Warehouse',   code:'WH',  company_id:'company-1', lot_stock_id:'loc-main-stock' },
  { id:'wh-east',  name:'East Distribution',code:'EAST',company_id:'company-1', lot_stock_id:'loc-east-stock' },
]

export const LOCATIONS = [
  { id:'loc-suppliers',  name:'Vendors',          complete_name:'Virtual Locations/Vendors',   usage:'supplier',  active:true },
  { id:'loc-customers',  name:'Customers',         complete_name:'Virtual Locations/Customers',  usage:'customer',  active:true },
  { id:'loc-main-stock', name:'Stock',             complete_name:'WH/Stock',                     usage:'internal',  active:true },
  { id:'loc-main-input', name:'Input',             complete_name:'WH/Input',                     usage:'internal',  active:true },
  { id:'loc-main-out',   name:'Output',            complete_name:'WH/Output',                    usage:'internal',  active:true },
  { id:'loc-east-stock', name:'Stock',             complete_name:'EAST/Stock',                   usage:'internal',  active:true },
]

export const PRODUCTS = [
  { id:'prod-001', name:'ERP Base License',     type:'service',    categ_id:'categ-software', list_price:10000, standard_price:0,    uom_id:'uom-unit', active:true, description:'Core ERP license for 1 company' },
  { id:'prod-002', name:'Implementation Hours', type:'service',    categ_id:'categ-services', list_price:100,   standard_price:60,   uom_id:'uom-hour', active:true },
  { id:'prod-003', name:'Annual Support',       type:'service',    categ_id:'categ-services', list_price:6000,  standard_price:2000, uom_id:'uom-unit', active:true },
  { id:'prod-004', name:'Training Session',     type:'service',    categ_id:'categ-services', list_price:150,   standard_price:50,   uom_id:'uom-unit', active:true },
  { id:'prod-005', name:'Custom Development',   type:'service',    categ_id:'categ-services', list_price:250,   standard_price:120,  uom_id:'uom-hour', active:true },
  { id:'prod-006', name:'Office Laptop Pro',    type:'product',    categ_id:'categ-hardware', list_price:1299,  standard_price:850,  uom_id:'uom-unit', active:true },
  { id:'prod-007', name:'USB-C Hub 7-port',     type:'product',    categ_id:'categ-hardware', list_price:49,    standard_price:22,   uom_id:'uom-unit', active:true },
  { id:'prod-008', name:'Mechanical Keyboard',  type:'product',    categ_id:'categ-hardware', list_price:129,   standard_price:55,   uom_id:'uom-unit', active:true },
  { id:'prod-009', name:'27" Monitor 4K',       type:'product',    categ_id:'categ-hardware', list_price:549,   standard_price:310,  uom_id:'uom-unit', active:true },
  { id:'prod-010', name:'Office Chair Ergonomic',type:'product',   categ_id:'categ-office',   list_price:399,   standard_price:180,  uom_id:'uom-unit', active:true },
  { id:'prod-011', name:'Standing Desk',        type:'product',    categ_id:'categ-office',   list_price:699,   standard_price:320,  uom_id:'uom-unit', active:true },
  { id:'prod-012', name:'Whiteboard 180x90',    type:'product',    categ_id:'categ-office',   list_price:149,   standard_price:65,   uom_id:'uom-unit', active:true },
  { id:'prod-013', name:'A4 Paper (500 sheets)', type:'consumable', categ_id:'categ-consumables', list_price:8,  standard_price:4,   uom_id:'uom-pack', active:true },
  { id:'prod-014', name:'Ballpoint Pen Box',    type:'consumable', categ_id:'categ-consumables', list_price:12, standard_price:5,   uom_id:'uom-box',  active:true },
  { id:'prod-015', name:'Network Switch 24p',   type:'product',    categ_id:'categ-hardware', list_price:299,   standard_price:145,  uom_id:'uom-unit', active:true },
  { id:'prod-016', name:'Server Rack 12U',      type:'product',    categ_id:'categ-hardware', list_price:899,   standard_price:420,  uom_id:'uom-unit', active:true },
  { id:'prod-017', name:'Ethernet Cable 5m',    type:'product',    categ_id:'categ-hardware', list_price:9,     standard_price:3,    uom_id:'uom-unit', active:true },
  { id:'prod-018', name:'Toner Cartridge Black', type:'consumable', categ_id:'categ-consumables', list_price:55, standard_price:28,  uom_id:'uom-unit', active:true },
  { id:'prod-019', name:'Coffee Machine',       type:'product',    categ_id:'categ-office',   list_price:249,   standard_price:110,  uom_id:'uom-unit', active:true },
  { id:'prod-020', name:'Water Cooler Dispenser',type:'product',   categ_id:'categ-office',   list_price:179,   standard_price:85,   uom_id:'uom-unit', active:true },
]

// Current stock levels (quants)
export const QUANTS = [
  { id:'quant-001', product_id:'prod-006', location_id:'loc-main-stock', quantity:14, reserved_quantity:2 },
  { id:'quant-002', product_id:'prod-007', location_id:'loc-main-stock', quantity:35, reserved_quantity:0 },
  { id:'quant-003', product_id:'prod-008', location_id:'loc-main-stock', quantity:22, reserved_quantity:5 },
  { id:'quant-004', product_id:'prod-009', location_id:'loc-main-stock', quantity:8,  reserved_quantity:1 },
  { id:'quant-005', product_id:'prod-010', location_id:'loc-main-stock', quantity:18, reserved_quantity:0 },
  { id:'quant-006', product_id:'prod-011', location_id:'loc-main-stock', quantity:6,  reserved_quantity:0 },
  { id:'quant-007', product_id:'prod-012', location_id:'loc-main-stock', quantity:4,  reserved_quantity:0 },
  { id:'quant-008', product_id:'prod-013', location_id:'loc-main-stock', quantity:120,reserved_quantity:10 },
  { id:'quant-009', product_id:'prod-014', location_id:'loc-main-stock', quantity:60, reserved_quantity:0 },
  { id:'quant-010', product_id:'prod-015', location_id:'loc-main-stock', quantity:5,  reserved_quantity:2 },
  { id:'quant-011', product_id:'prod-017', location_id:'loc-main-stock', quantity:200,reserved_quantity:0 },
  { id:'quant-012', product_id:'prod-018', location_id:'loc-main-stock', quantity:30, reserved_quantity:0 },
  { id:'quant-013', product_id:'prod-006', location_id:'loc-east-stock', quantity:7,  reserved_quantity:0 },
  { id:'quant-014', product_id:'prod-009', location_id:'loc-east-stock', quantity:3,  reserved_quantity:0 },
]
