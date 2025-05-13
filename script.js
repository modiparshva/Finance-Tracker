let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateTotals() {
    let income = 0;
    let expense = 0;
    let savings = 0;
    let sv = 0;
    let mf = 0;
    let fd = 0;

    transactions.forEach((t) => {
    if (t.type === "Income") {
        income += t.amount;
    } else {
        expense += t.amount;
    }
    savings = income - expense;
    sv = savings * 30/100;
    mf = savings * 20/100;
    fd = savings * 10/100;
    });

    if (savings > 0){
    document.getElementById("stocksValue").textContent = `$${sv.toFixed(2)}`;
    document.getElementById("mfValue").textContent = `$${mf.toFixed(2)}`;
    document.getElementById("fdValue").textContent = `$${fd.toFixed(2)}`;
    }
    document.getElementById("totalSavings").textContent = `$${savings.toFixed(2)}`;
    document.getElementById("totalIncome").textContent = `$${income.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${expense.toFixed(2)}`;
}

function renderTable() {
    const tbody = document.getElementById("transactionTable");
    tbody.innerHTML = "";

    transactions.forEach((t, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${t.title}</td>
        <td>$${t.amount.toFixed(2)}</td>
        <td>${t.type}</td>
        <td><button onclick="deleteTransaction(${index})">Delete</button></td>
    `;
    tbody.appendChild(row);
    });
}

function addTransaction() {
    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!title || isNaN(amount) || amount < 0) {
    alert("Please enter valid title and amount.");
    return;
    }

    transactions.push({ title, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    updateTotals();
    renderTable();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTotals();
    renderTable();
}

function generateReport() {
    if (transactions.length === 0) {
        document.getElementById("reportOutput").innerHTML = "<p>No transactions to report.</p>";
        return;
    }

    let totalIncome = 0, totalExpense = 0;
    let highestIncome = 0, highestExpense = 0;
    let incomeTitle = "", expenseTitle = "";

    transactions.forEach((t) => {
        if (t.type === "Income") {
            totalIncome += t.amount;
            if (t.amount > highestIncome) {
            highestIncome = t.amount;
            incomeTitle = t.title;
            }
        } else {
            totalExpense += t.amount;
            if (t.amount > highestExpense) {
            highestExpense = t.amount;
            expenseTitle = t.title;
            }
        }
    });

    const reportHTML = `
    <p><strong>Total Transactions:</strong> ${transactions.length}</p>
    <p><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> $${totalExpense.toFixed(2)}</p>
    <p><strong>Highest Income:</strong> $${highestIncome.toFixed(2)} (${incomeTitle})</p>
    <p><strong>Highest Expense:</strong> $${highestExpense.toFixed(2)} (${expenseTitle})</p>
    `;

    document.getElementById("reportOutput").innerHTML = reportHTML;
}

function downloadPDF() {
    generateReport(); 
    const report = document.getElementById("reportOutput");
    const opt = {
        margin:       0.5,
        filename:     'finance_report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(report).set(opt).save();
}

function printReport() {
    generateReport();
    const reportContent = document.getElementById("reportOutput").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = reportContent;
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}

updateTotals();
renderTable();
