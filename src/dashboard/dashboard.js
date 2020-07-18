getUserData()
getUSerIncomeExpenseData()
incomeExpenseTable()


let yIncome = []
let yExpense = []
chartData()

function chartData() {
    // window.onload = function() {
    getDataForChart()

    setTimeout(function() {
        console.log('wait for getting data')

        const chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Income & Expense Report"
            },
            axisX: {
                // minimum: new Date(2020, 06, 01),
                // maximum: new Date(2020, 12, 15),
                valueFormatString: "MMM YY",
                title: "Months",
                titleFontStyle: "italic",
                titleFontColor: "#4F81BC",
                titleFontSize: 25

            },
            axisY: {
                title: "Amount",
                titleFontColor: "#4F81BC",
                titleFontStyle: "italic",
                titleFontSize: 15,
                suffix: "RS"
            },
            legend: {
                verticalAlign: "top",
                horizontalAlign: "right",
                dockInsidePlotArea: true
            },
            toolTip: {
                shared: true
            },
            data: [{
                    name: "Income",
                    showInLegend: true,
                    legendMarkerType: "square",
                    type: "area",
                    color: "rgba(0,75,141,0.7)",
                    markerSize: 0,
                    dataPoints: yIncome
                },
                {
                    name: "Expense",
                    showInLegend: true,
                    legendMarkerType: "square",
                    type: "area",
                    color: "rgb(253, 169, 13)",
                    markerSize: 0,
                    dataPoints: yExpense
                }
            ]
        });
        chart.render();

    }, 3000);
}

function getDataForChart() {
    yExpense.length = 0
    yIncome.length = 0
    const userId = localStorage.getItem('userId')
    const chartYear = document.getElementById('chart-Year').value

    firebase.firestore().collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get()
        .then(function(snaps) {
            snaps.forEach(function(doc) {
                let data = doc.data()
                    // debugger
                if (data.type == 'income' && chartYear == moment(data.date.toDate()).format('YYYY')) {
                    console.log('***********')
                    console.log('income data-->', data.amount, moment(data.date.toDate()).format('YYYY'))

                    yIncome.push({
                        x: new Date(moment(data.date.toDate())),
                        y: parseInt(data.amount)
                    })
                    console.log('data income Amount', data.amount)
                    console.log('yincome', yIncome)
                } else if (data.type == 'expense' && chartYear == moment(data.date.toDate()).format('YYYY')) {
                    console.log('***********')
                    console.log('expense data-->', data.amount, moment(data.date.toDate()).format('YYYY'))

                    yExpense.push({
                        x: new Date(moment(data.date.toDate())),
                        y: parseInt(data.amount)

                    })
                    console.log('data expense Amount', data.amount)
                    console.log('yexpense', yExpense)
                }
            });
        })
}



// Get user DataFor Dashboard
function getUserData() {
    const userId = localStorage.getItem('userId')
    console.log("user--->", userId)

    firebase.firestore().collection('users').doc(userId).get()
        .then(function(snapshot) {

            const userObj = snapshot.data()
            console.log('snapshot-->', userObj)
            const userElement = document.getElementById("user")
            userElement.innerHTML = userObj.userName


        }).catch(function(error) {
            alert(error.message)
        })
}

// Get User Expense data from Firestore
function getUSerIncomeExpenseData() {
    const totalIncome = document.getElementById('total-Income')
    const totalExpense = document.getElementById('total-Expense')
    const remainingBalance = document.getElementById('remaining-Balance')
    const userId = localStorage.getItem('userId')
    let amountTotal = 0
    let expenseTotal = 0

    firebase.firestore().collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get()
        .then(function(snaps) {
            snaps.forEach(function(doc) {
                console.log('DATA', doc.data())
                const data = doc.data()
                let dataAmount = +doc.data().amount
                console.log('DATA AMOUNT', dataAmount)
                    // debugger
                if (data.type == 'income') {
                    amountTotal = amountTotal + dataAmount
                    console.log('AmountTotal', amountTotal)
                    totalIncome.childNodes[1].data = amountTotal
                } else if (data.type == 'expense') {
                    expenseTotal = expenseTotal + dataAmount
                    console.log('ExpenseTotal', expenseTotal)
                    totalExpense.childNodes[1].data = expenseTotal
                }
                console.log("Remaining balance is --->", amountTotal - expenseTotal)
                remainingBalance.childNodes[1].data = amountTotal - expenseTotal


            });
        })
}


// Side navbar toggles
function openNavBar() {
    document.getElementById('sideNavBar').style.width = "19%"
    document.getElementsByClassName('overlay')[0].style.display = 'block'
}

function closeNavBar() {
    document.getElementById('sideNavBar').style.width = "0"
    document.getElementsByClassName('overlay')[0].style.display = 'none'
}

// Page Navigation
function navigation() {
    window.addEventListener('click', function(e) {

        console.log(e.target.innerText)
        let option = e.target.innerText
        switch (option) {
            case 'Dashboard':
                window.location.replace("dashboard.html")
                break
            case 'Transactions':
                window.location.replace('../transaction/transaction.html')
                break
            case 'About':
                window.location.replace('../transaction/transaction.html')
                break
            case 'Logout':
                window.location.replace('../../index.html')
                break
            case 'View more':
                window.location.replace('../transaction/transaction.html')
                break
        }
    })
}

// Income Expense Table
function incomeExpenseTable() {
    const userId = localStorage.getItem('userId')
    const incomeTable = document.getElementsByTagName('tbody')[0]
    const expenseTable = document.getElementsByTagName('tbody')[1]
    incomeTable.innerHTML = ""
    expenseTable.innerHTML = ""
        // debugger
    firebase.firestore().collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc').limit(6)
        .get()
        .then(function(snaps) {
            snaps.forEach(function(doc) {
                console.log('doc.data()', doc.data())
                const data = doc.data()
                const row = document.createElement('TR')
                const type = document.createElement('TD')
                const type2 = document.createElement('TD')
                const amount = document.createElement('TD')
                const category = document.createElement('TD')

                const expenseRow = document.createElement('TR')
                const expenseType = document.createElement('TD')
                const expenseType2 = document.createElement('TD')
                const expenseAmount = document.createElement('TD')
                const expenseCategory = document.createElement('TD')


                if (data.type == 'income') {
                    type.innerHTML = "<img src='../transaction/images/right-arrow.png'</img>"
                    type2.innerHTML = "<img src='../transaction/images/up-arrow.png'</img>"

                    amount.innerHTML = '<span>Rs </span>' + data.amount
                    category.innerHTML = data.category
                    row.appendChild(type)
                    row.appendChild(category)
                    row.appendChild(amount)
                    row.appendChild(type2)
                    incomeTable.appendChild(row)
                } else
                if (data.type == 'expense') {
                    expenseType.innerHTML = `<img src="${data.receipt}" />`
                    expenseType2.innerHTML = "<img src='../transaction/images/down-arrow.png'</img>"

                    expenseAmount.innerHTML = '<span>Rs </span>' + data.amount
                    expenseCategory.innerHTML = data.category
                    expenseRow.appendChild(expenseType)
                    expenseRow.appendChild(expenseCategory)
                    expenseRow.appendChild(expenseAmount)
                    expenseRow.appendChild(expenseType2)
                    expenseTable.appendChild(expenseRow)
                }

            });
        })
}