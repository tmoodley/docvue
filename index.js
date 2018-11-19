Vue.component('data-table', {
    props: ['post'],
    template: `
    <div class="col-md-12">
        <div class="form-group">
        <input type="text" class="form-control" v-model="search" placeholder="Search">
        </div>
        <div>
            Filtered Docs <document-label-list v-for="(docs, index) in (filteredDocs)" :key="index" :name="docs" @removed="handleRemoved"></document-label-list> 
        </div>
        <div class="table-responsive">
        <table class="table table-striped table-bordered" style="width:100%">
            <thead width="400px">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col" @click="sort('givenName')">GivenName <i class="fas fa-sort-alpha-down float-right"></i></th>
                    <th scope="col" @click="sort('surname')">Surname<i class="fas fa-sort-alpha-down float-right"></i></th>
                    <th scope="col" @click="sort('email')">Email<i class="fas fa-sort-alpha-down float-right"></i></th>
                    <th scope="col" @click="sort('jobTitle')">JobTitle<i class="fas fa-sort-alpha-down float-right"></i></th>
                    <th scope="col" @click="sort('company')">Company<i class="fas fa-sort-alpha-down float-right"></i></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in (sortedActivity, filteredList)" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{user.givenName}}
                            <document-label v-for="(docs, index) in (user.documents)" :key="index" :name="docs" @selected="handleSelected"></document-label> 
                    </td>
                    <td>{{user.surname}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.jobTitle}}</td>
                    <td>{{user.company}}</td>
                </tr>
            </tbody>
        </table>
        </div>
    <button @click="prevPage" class="float-left btn btn-outline-info btn-sm"><i class="fas fa-arrow-left"></i> Previous</button> 
    <button @click="nextPage" class="float-right btn btn-outline-info btn-sm">Next <i class="fas fa-arrow-right"></i></button>
    <span class="pull-right">Page {{currentPage}} </span>
    </div>
    `,
    data: () => ({
        users: [{
    "ID": 0,
    "givenName": "John",
    "surname": "Smith",
    "dateOfBirth": "1986-10-03T00:00:00",
    "email": "john.smith@smithsteel.com",
    "jobTitle": "Co-Founder and CEO",
    "company": "Smith Steel Pty Ltd",
    "documents": [ 'book', 'contract' ]
}, {
    "ID": 1,
    "givenName": "Jane",
    "surname": "Smith",
    "dateOfBirth": "1988-05-28T00:00:00",
    "email": "jane.smith@smithsteel.com",
    "jobTitle": "Co-Founder and CEO",
    "company": "Smith Steel Pty Ltd",
    "documents": [ 'agreement' ]
}, {
    "ID": 2,
    "givenName": "Richard",
    "surname": "Swanston",
    "dateOfBirth": "1972-08-15T00:00:00",
    "email": "rswanston@telco.com",
    "jobTitle": "Purchasing Officer",
    "company": "Cortana Mining Co",
    "documents": [ 'book' ]
}, {
    "ID": 3,
    "givenName": "Robert",
    "surname": "Brown",
    "dateOfBirth": "1968-01-18T00:00:00",
    "email": "robbrown@othertelco.com",
    "jobTitle": "Sales Manager",
    "company": "Powerhouse Marketing",
    "documents": [ 'contract' ]
}, {
    "ID": 4,
    "givenName": "Phillip",
    "surname": "Zucco",
    "dateOfBirth": "1991-06-28T00:00:00",
    "email": "phil.zucco@workplace.com",
    "jobTitle": "Applications Developer",
    "company": "Workplace Pty Ltd",
    "documents": [ 'book', 'contract' ]
}, {
    "ID": 5,
    "givenName": "James",
    "surname": "Caldwell",
    "dateOfBirth": "1988-07-27T00:00:00",
    "email": "james.caldwell@random.com",
    "jobTitle": "Purchasing Officer",
    "company": "Random Industries Ltd.",
    "documents": [ 'book', 'contract' ]
}, {
    "ID": 6,
    "givenName": "Rachael",
    "surname": "O'Reilly",
    "dateOfBirth": "1972-08-15T00:00:00",
    "email": "roreilly@energy.com",
    "jobTitle": "Workplace Health and Safety Officer",
    "company": "Energy company",
    "documents": [ 'book', 'contract' ]
}],
        currentSort:'name',
        currentSortDir:'asc',
        search: '',
        originalList: [],
        filteredDocs: [],
        searchSelection: '',
        pageSize: 5,
        currentPage: 1
    }),
    methods:{
        sort:function(s) {
        if(s === this.currentSort) {
            this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
        }
        this.currentSort = s;
        },
        nextPage:function() {
        if((this.currentPage*this.pageSize) < this.users.length) this.currentPage++;
        },
        prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
        },
        handleSelected(payload) { 
            if(this.filteredDocs.indexOf(payload) === -1) {
                this.filteredDocs.push(payload); 
                this.filteredDocumentList(payload);
            }
            //reset page
            this.currentPage = 1;
        },
        handleRemoved(payload) {  
            var index = this.filteredDocs.indexOf(payload);
            this.filteredDocs.splice(index, 1);  
            //reload users 
            this.users = this.originalList; 
        }, 
        filteredDocumentList () {  
            let newList = [];
            let _users = this.users; 
            this.filteredDocs.forEach( function(doc) { 
                _users.forEach( function(user) { 
                    if(user.documents != undefined){
                        if(user.documents.indexOf(doc.toLowerCase()) != -1){
                            newList.push(user)
                        }
                    } 
                }); 
            });

           this.users = newList;
        return this.users;
        }
    },
    computed: {
        sortedActivity:function() {
        return this.users.sort((a,b) => {
            let modifier = 1;
            if(this.currentSortDir === 'desc') modifier = -1;
            if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
            if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
            return 0;
        }).filter((row, index) => {
            let start = (this.currentPage-1)*this.pageSize;
            let end = this.currentPage*this.pageSize;
            if(index >= start && index < end) return true;
        });
        },
        filteredList () {
        return this.users.filter((data) => {
            let email = data.email.toLowerCase().match(this.search.toLowerCase());
            let givenName = data.givenName.toLowerCase().match(this.search.toLowerCase());
            let surname = data.surname.toLowerCase().match(this.search.toLowerCase());
            let company = data.company.toLowerCase().match(this.search.toLowerCase()); 
            return email || givenName || surname || company;
        }).filter((row, index) => {
            let start = (this.currentPage-1)*this.pageSize;
            let end = this.currentPage*this.pageSize;
            if(index >= start && index < end) return true;
        });
        }
    },
    created () { 
        this.originalList = [...this.users]; 
        // axios.get('https://api.iextrading.com/1.0/stock/market/list/mostactive')
        // .then(function (response) {
        //     console.log(response); 
        // })
        // .catch(function (error) {
        //     console.log(error);  
        // });
        // axios.get('https://jsonplaceholder.typicode.com/users')
        // .then(response => {
        //     this.users = response.data
        // })
    }
    }); 
    Vue.component('document-label-list', {
    props: ['name'],
    data: function () {
        return {
        count: 0
        }
    },
    template: '<span @click="removeDocuments(name)" class="label label-warning" style="margin-right:2px">{{ name }} <i class="fas fa-times"></i></span>',
    methods: {
        removeDocuments:function(item) { 
        this.$emit('removed', item);
        }
    } 
    });
    // Define a new component called document-label
    Vue.component('document-label', {
    props: ['name'],
    data: function () {
        return {
        count: 0
        }
    },
    template: '<span @click="filterDocuments(name)" class="label label-warning" style="margin-right:2px">{{ name }}</span> ',
    methods: {
        filterDocuments:function(item) {
        this.$emit('selected', item);
        }
    } 
    });
var app = new Vue({
 el: '#app'
});