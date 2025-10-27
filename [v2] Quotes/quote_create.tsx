import React, { useState } from 'react';
import { Search, Plus, X, Copy, DollarSign, Calendar, FileText, Send, AlertCircle, Clock, Square, Package } from 'lucide-react';

export default function QuoteCreationPage() {
  const [businessType, setBusinessType] = useState('tutoring'); // tutoring or cleaning
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [quoteItems, setQuoteItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage'); // percentage or fixed
  const [approvalRequired, setApprovalRequired] = useState(false);

  const customers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '0412 345 678', address: '123 Main St, Melbourne', previousQuotes: 2 },
    { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', phone: '0423 456 789', address: '456 Park Ave, Melbourne', previousQuotes: 5 },
  ];

  const tutoringServices = [
    { id: 't1', name: 'One-on-One Tutoring - Math', category: 'Tutoring', price: 75, pricingType: 'per_hour', unit: 'hour' },
    { id: 't2', name: 'One-on-One Tutoring - English', category: 'Tutoring', price: 75, pricingType: 'per_hour', unit: 'hour' },
    { id: 't3', name: 'Small Group (2-4 students)', category: 'Group', price: 50, pricingType: 'per_hour_per_student', unit: 'hour/student' },
    { id: 't4', name: 'Assessment & Report', category: 'Assessment', price: 120, pricingType: 'fixed', unit: 'one-time' },
    { id: 't5', name: 'Study Materials Package', category: 'Materials', price: 45, pricingType: 'per_unit', unit: 'package' },
  ];

  const cleaningServices = [
    { id: 'c1', name: 'Regular House Cleaning', category: 'Residential', price: 50, pricingType: 'per_hour', unit: 'hour' },
    { id: 'c2', name: 'Deep Cleaning', category: 'Residential', price: 65, pricingType: 'per_hour', unit: 'hour' },
    { id: 'c3', name: 'End of Lease Cleaning', category: 'Residential', price: 35, pricingType: 'per_sqm', unit: 'sqm' },
    { id: 'c4', name: 'Carpet Cleaning', category: 'Specialist', price: 8, pricingType: 'per_sqm', unit: 'sqm' },
    { id: 'c5', name: 'Window Cleaning', category: 'Specialist', price: 15, pricingType: 'per_unit', unit: 'window' },
    { id: 'c6', name: 'Office Cleaning', category: 'Commercial', price: 40, pricingType: 'per_hour', unit: 'hour' },
    { id: 'c7', name: 'Oven Cleaning', category: 'Specialist', price: 89, pricingType: 'fixed', unit: 'one-time' },
  ];

  const services = businessType === 'tutoring' ? tutoringServices : cleaningServices;

  const addQuoteItem = (service) => {
    const newItem = {
      ...service,
      quantity: 1,
      customPrice: service.price,
      notes: ''
    };
    setQuoteItems([...quoteItems, newItem]);
  };

  const removeQuoteItem = (index) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  const updateQuoteItem = (index, field, value) => {
    const updated = [...quoteItems];
    updated[index][field] = value;
    setQuoteItems(updated);
  };

  const calculateSubtotal = () => {
    return quoteItems.reduce((sum, item) => sum + (item.customPrice * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return subtotal * (discount / 100);
    }
    return discount;
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    const discountAmount = discountType === 'percentage' ? calculateSubtotal() * (value / 100) : value;
    const discountPercent = (discountAmount / calculateSubtotal()) * 100;
    setApprovalRequired(discountPercent > 20);
  };

  const getPricingIcon = (type) => {
    switch(type) {
      case 'per_hour': return <Clock size={16} />;
      case 'per_sqm': return <Square size={16} />;
      case 'per_unit': return <Package size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Quote</h1>
              <p className="text-gray-600 mt-1">
                <select 
                  value={businessType} 
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="bg-transparent border-none font-medium text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="tutoring">Sunshine Tutoring - Melbourne East</option>
                  <option value="cleaning">SparkleClean Services - Melbourne</option>
                </select>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FileText size={18} />
                Preview
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Customer & Services */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Customer Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                <button 
                  onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                  className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                >
                  <Plus size={16} />
                  New Customer
                </button>
              </div>

              {!selectedCustomer && !showNewCustomerForm && (
                <div>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search customer by name, email, or phone..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {customers.filter(c => 
                      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.email.toLowerCase().includes(customerSearch.toLowerCase())
                    ).map(customer => (
                      <div 
                        key={customer.id} 
                        className="border border-gray-200 rounded p-3 hover:border-blue-500 cursor-pointer text-sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-600">{customer.email} • {customer.phone}</p>
                          </div>
                          {customer.previousQuotes > 0 && (
                            <button className="text-xs text-blue-600 flex items-center gap-1">
                              <Copy size={12} />
                              Clone
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCustomer && (
                <div className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedCustomer.email}</p>
                      <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                      <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}

              {showNewCustomerForm && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="First Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    <input type="text" placeholder="Last Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="tel" placeholder="Phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="Address" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowNewCustomerForm(false)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Create & Select
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Services Catalog */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Catalog</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {services.map(service => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{service.category}</span>
                        <h3 className="font-medium text-gray-900 mt-1 text-sm">{service.name}</h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        {getPricingIcon(service.pricingType)}
                        <span className="text-sm font-semibold">${service.price}</span>
                        <span className="text-xs">/ {service.unit}</span>
                      </div>
                      <button 
                        onClick={() => addQuoteItem(service)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Items Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Line Items</h2>
              
              {quoteItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm">No items added yet. Select services from the catalog above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-2 font-medium text-gray-700">Service</th>
                        <th className="text-left p-2 font-medium text-gray-700">Type</th>
                        <th className="text-center p-2 font-medium text-gray-700">Qty</th>
                        <th className="text-right p-2 font-medium text-gray-700">Unit Price</th>
                        <th className="text-right p-2 font-medium text-gray-700">Total</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item, index) => (
                        <React.Fragment key={index}>
                          <tr className="border-b border-gray-100">
                            <td className="p-2">
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-1 text-gray-600">
                                {getPricingIcon(item.pricingType)}
                                <span className="text-xs">{item.unit}</span>
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuoteItem(index, 'quantity', Number(e.target.value))}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                                min="1"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <input 
                                type="number"
                                value={item.customPrice}
                                onChange={(e) => updateQuoteItem(index, 'customPrice', Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-right font-semibold">
                              ${(item.quantity * item.customPrice).toFixed(2)}
                            </td>
                            <td className="p-2">
                              <button 
                                onClick={() => removeQuoteItem(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td colSpan="6" className="p-2 pb-3">
                              <input 
                                type="text"
                                value={item.notes}
                                onChange={(e) => updateQuoteItem(index, 'notes', e.target.value)}
                                placeholder="Add notes for this line item..."
                                className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-gray-600"
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-4">
            
            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Discount</span>
                    <div className="flex items-center gap-2">
                      <select 
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">$</option>
                      </select>
                      <input 
                        type="number"
                        value={discount}
                        onChange={(e) => handleDiscountChange(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                        min="0"
                        step={discountType === 'percentage' ? '1' : '0.01'}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm font-medium text-red-600">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                </div>

                {approvalRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex items-start gap-2">
                    <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">Manager approval required (discount {'>'}20%)</p>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-gray-900 text-lg">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valid Until</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Due on acceptance</option>
                    <option>Net 7 days</option>
                    <option>Net 14 days</option>
                    <option>Net 30 days</option>
                    <option>50% deposit, 50% on completion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes for Customer</label>
                  <textarea 
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Terms, conditions, or special notes..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Internal Notes</label>
                  <textarea 
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Private notes (not visible to customer)..."
                  ></textarea>
                </div>
              </div>

              {/* Send Options */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Send Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="send" defaultChecked />
                    <Send size={14} />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="send" />
                    <span>SMS with Portal Link</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="send" />
                    <span>Print/Manual</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {approvalRequired && (
                  <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 text-sm font-medium">
                    Submit for Approval
                  </button>
                )}
                <button 
                  disabled={quoteItems.length === 0 || !selectedCustomer}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}