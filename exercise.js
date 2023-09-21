const fees = require("./fees.json");
const orders = require("./orders.json");

const printFees = () => {
  for (let order of orders) {
    console.log(`Order ID: ${order.order_number}`);
    let orderTotal = 0;
    let itemNum = 1;

    for (let item of order.order_items) {
      let itemFee = 0;
      for (let fee of fees) {
        if (item.type === fee.order_item_type) {
          for (let f of fee.fees) {
            if (f.type === "flat") {
              itemFee += parseFloat(f.amount);
            } else if (f.type === "per-page" && item.pages > 1) {
              itemFee += parseFloat(f.amount) * (item.pages - 1);
            }
          }
        }
      }

      console.log(`   Order item ${itemNum}: $${itemFee.toFixed(2)}`);
      orderTotal += itemFee;
      itemNum++;
    }

    console.log(`\n   Order total: $${orderTotal.toFixed(2)}\n`);
  }
};

const printDistributions = () => {
  let distributionTotals = {};

  for (let order of orders) {
    console.log(`Order ID: ${order.order_number}`);

    for (let item of order.order_items) {
      let itemTotal = 0;

      for (let fee of fees) {
        if (item.type === fee.order_item_type) {
          for (let f of fee.fees) {
            if (f.type === "flat") {
              itemTotal += parseFloat(f.amount);
            } else if (f.type === "per-page" && item.pages > 1) {
              itemTotal += parseFloat(f.amount) * (item.pages - 1);
            }
          }

          let allocatedAmount = 0;
          for (let dist of fee.distributions) {
            let distAmount = parseFloat(dist.amount);
            console.log(`   Fund - ${dist.name}: $${distAmount.toFixed(2)}`);
            allocatedAmount += distAmount;

            if (distributionTotals[dist.name]) {
              distributionTotals[dist.name] += distAmount;
            } else {
              distributionTotals[dist.name] = distAmount;
            }
          }

          let otherAmount = itemTotal - allocatedAmount;
          if (otherAmount > 0) {
            console.log(`   Fund - Other: $${otherAmount.toFixed(2)}`);
            if (distributionTotals["Other"]) {
              distributionTotals["Other"] += otherAmount;
            } else {
              distributionTotals["Other"] = otherAmount;
            }
          }
        }
      }
    }
  }

  console.log("Total distributions:");
  for (let [key, value] of Object.entries(distributionTotals)) {
    console.log(`   Fund - ${key}: $${value.toFixed(2)}`);
  }
};

printFees();
printDistributions();
