getUserData()
getMonthAndYear()
getTransactions()


function openNavBar() {
    document.getElementById('sideNavBar').style.width = "19%"
    document.getElementsByClassName('overlay')[0].style.display = 'block'
    document.getElementById('sideNavBar')
}

function closeNavBar() {
    document.getElementById('sideNavBar').style.width = "0"
    document.getElementsByClassName('overlay')[0].style.display = 'none'
}

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
            swal({
                title: error.message,
                icon: "warning",
            });
        })
}

// Page Navigation
function navigation() {
    window.addEventListener('click', function(e) {
        console.log(e.target.innerText)
        if (e.target.innerText == 'Dashboard') {
            window.location.replace("../dashboard/dashboard.html")
        } else if (e.target.innerText == 'Transactions') {
            window.location.replace('transaction.html')
        } else if (e.target.innerText == 'About') {
            window.location.replace('transaction.html')
        } else if (e.target.innerText == 'Logout') {
            window.location.replace('../../index.html')
        }
    })
}

function getMonthAndYear() {
    const dateToday = new Date()
    const currentMonth = dateToday.getMonth()
    const CurrentYear = dateToday.getFullYear()
    console.log(dateToday)
    console.log(currentMonth + 1)

    const yearElement = document.getElementById("year")
    yearElement.value = CurrentYear
    const monthElement = document.getElementById("month")
    monthElement.value = currentMonth + 1

}

function todayDate() {
    let date = new Date()
    const currentDate = date.getDate()
    const currentMonth = date.getMonth() + 1
    const CurrentYear = date.getFullYear()
    let setDate, setMonth
    if (currentDate < 9) {
        setDate = '0' + currentDate
        console.log("Date--->" + setDate)
    } else {
        setDate = currentDate
    }
    if (currentMonth < 9) {
        setMonth = '0' + currentMonth
        console.log("Month--->" + setMonth)
    } else {
        setMonth = currentMonth
        console.log("Month" + setMonth)
    }
    console.log(currentDate)
    let dateOption = document.getElementById("myDate")
    let dateOption2 = document.getElementById("myDate2")
        // debugger
    let dateOptions = CurrentYear + '-' + setMonth + '-' + setDate
        // for income modal
    dateOption.defaultValue = dateOptions
        //for expense modal
    dateOption2.defaultValue = dateOptions
}




function saveIncome() {
    const userId = localStorage.getItem('userId')
    const amount = document.getElementById("amount").value
    const date = document.getElementById("myDate").valueAsDate
    const discription = document.getElementById("description").value
    const category = document.getElementById("category").value
    const account = document.getElementById('account').value
        // debugger

    if (!(userId == "" || amount == "" || discription == "")) {
        console.log(amount, date, discription, category)
        firebase.firestore().collection("transactions").add({
            amount,
            date,
            discription,
            category,
            userId,
            account,
            type: 'income'
        }).then(function() {
            swal({
                title: "Transaction Successful",
                icon: "success",
            });
            getTransactions()
            $('#incomeModel').modal('hide')
            clearForm()
        })

    } else if (userId == "" || amount == "" || discription == "") {
        swal({
            title: "Please fill all fields",
            icon: "warning",
        });
    }
}



function clearForm() {
    document.getElementById("amount").value = ''
    document.getElementById("description").value = ''
    document.getElementById("amount").value = ''
        // document.getElementById("myDate").valueAsDate = ''
}

function saveExpense() {
    const userId = localStorage.getItem('userId')
    const amount = document.getElementById("amount-expense").value
    const date = document.getElementById("myDate2").valueAsDate
    const discription = document.getElementById("description-expense").value
    const category = document.getElementById("category-expense").value
    const account = document.getElementById('account-expense').value
    const imageFile = document.getElementById('file-expense').files[0]

    if (!(userId == "" || amount == "" || discription == "" || imageFile == "")) {
        const storageRef = firebase.storage().ref(`${Date.now()}.jpg`);
        storageRef.put(imageFile).then(function(response) {
            console.log('response-->', response)
            response.ref.getDownloadURL().then(function(url) {
                console.log('url-->', url)

                firebase.firestore().collection('transactions').add({
                    amount,
                    date,
                    discription,
                    category,
                    account,
                    userId,
                    receipt: url,
                    type: 'expense'
                }).then(function() {
                    swal({
                        title: "Transaction Successful",
                        icon: "success",
                    });
                    getTransactions()
                    $('#expenseModel').modal('hide')
                    clearForm()
                })
            })
        }).catch(function(error) {
            if (userId == "" || amount == "" || discription == "") {
                swal({
                    title: "Please fill all fields",
                    icon: "warning",
                });
            }

            console.log("error-->", error.message)

        })
    } else if (userId == "" || amount == "" || discription == "") {
        swal({
            title: "Please fill all fields",
            icon: "warning",
        });
    }


}



function getTransactions() {
    const userId = localStorage.getItem('userId')
    const table = document.getElementsByTagName('tbody')[0]
    table.innerHTML = ""

    firebase.firestore().collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get()
        .then(function(snaps) {
            snaps.forEach(function(doc) {
                console.log('doc.data()', doc.data())
                const data = doc.data()
                const row = document.createElement('TR')
                const type = document.createElement('TD')
                const amount = document.createElement('TD')
                const category = document.createElement('TD')
                const date = document.createElement('TD')
                const type2 = document.createElement('TD')

                if (data.type == 'income') {
                    type.innerHTML = "<img src='images/right-arrow.png'</img>"
                } else {
                    type.innerHTML = "<img src='images/left-arrow (1).png'</img>"
                }
                amount.innerHTML = '<span>Rs </span>' + data.amount
                category.innerHTML = data.category
                date.innerHTML = moment(data.date.toDate()).format('dddd, MMMM Do YYYY');
                if (data.type == 'income') {
                    type2.innerHTML = "<img src='images/up-arrow.png'</img>"
                } else {
                    type2.innerHTML = "<img src='images/down-arrow.png'</img>"
                }

                row.appendChild(type)
                row.appendChild(date)
                row.appendChild(category)
                row.appendChild(amount)
                row.appendChild(type2)
                table.appendChild(row)
            });
        })
}

function filter() {
    const userId = localStorage.getItem('userId')
    const typeFilter = document.getElementById('type-filter').value
    const yearFilter = document.getElementById('year').value
    const monthFilter = document.getElementById('month').value

    if (typeFilter == "both") {
        return getTransactions()
    }
    const table = document.getElementsByTagName('tbody')[0]
    table.innerHTML = ""

    firebase.firestore().collection('transactions')
        .where('type', '==', typeFilter)
        .where('userId', '==', userId)
        .orderBy("date", "desc")
        .get()
        .then(function(snaps) {
            snaps.forEach(function(doc) {
                const data = doc.data()

                console.log("year--->", moment(data.date.toDate()).format('YYYY'))
                console.log('month---****', moment(data.date.toDate()).format('M'))
                console.log('month Filter---****', monthFilter)
                debugger
                if ((moment(data.date.toDate()).format('YYYY') == yearFilter) && (data.type == typeFilter) && (moment(data.date.toDate()).format('M') == monthFilter)) {
                    debugger
                    const row = document.createElement('TR')
                    const type = document.createElement('TD')
                    const amount = document.createElement('TD')
                    const category = document.createElement('TD')
                    const date = document.createElement('TD')
                    const type2 = document.createElement('TD')

                    if (data.type == 'income') {
                        type.innerHTML = "<img src='images/right-arrow.png'</img>"
                    } else {
                        type.innerHTML = "<img src='images/left-arrow (1).png'</img>"
                    }
                    amount.innerHTML = '<span>Rs </span>' + data.amount
                    category.innerHTML = data.category
                    date.innerHTML = moment(data.date.toDate()).format('dddd, MMMM Do YYYY');
                    if (data.type == 'income') {
                        type2.innerHTML = "<img src='images/up-arrow.png'</img>"
                    } else {
                        type2.innerHTML = "<img src='images/down-arrow.png'</img>"
                    }

                    row.appendChild(type)
                    row.appendChild(date)
                    row.appendChild(category)
                    row.appendChild(amount)
                    row.appendChild(type2)
                    table.appendChild(row)
                }
            });
        })
}