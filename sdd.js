const baseSchedule = {
  Monday:    [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Tuesday:   [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Wednesday: [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Thursday:  [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Friday:    [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Saturday:  [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }],
  Sunday:    [{ productid: "69410b87755a021be3dfeddf", qty: 2, time: "03:00" }]
};
const customers = [];

for (let i = 1; i <= 20; i++) {
  customers.push({
    name: `Customer ${i}`,
    phone: `03000000${100 + i}`,
    billdue: "0",
    email: `customer${i}@example.com`,
    credits: "0",
    securitydeposit: "0",
    status: "active",
    address: `Street ${i}, City`,
    location: [67.001 + i * 0.001, 24.860 + i * 0.001],
    schedule: baseSchedule
  });
}
async function addCustomers() {
  for (let i = 0; i < customers.length; i++) {
    const cust = customers[i];

    try {
      const res = await fetch("http://localhost:4000/api/cust/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          securitydeposit: cust.securitydeposit,
          address: cust.address,
          billdue: cust.billdue,
          schedule: cust.schedule,
          location: cust.location
        })
      });

      const data = await res.json();
      console.log(`Added: ${cust.name}`, data);

    } catch (err) {
      console.error(`Error adding ${cust.name}`, err);
    }
  }

  console.log("✅ All customers added");
}
addCustomers()