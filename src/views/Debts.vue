<template>
    <div>
        <navbar/>
        <background>
            <h1 class='header'>My debts</h1>
            <div class='search-wrapper'>
                <input class='form-control' type='text' v-model='search' placeholder='Search'/>
            </div>
            <div id='table'>
                <table class='table table-bordered table-hover'>
                    <thead>
                    <tr>
                        <th scope='col'>Title</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Owner name</th>
                        <th class='d-none d-md-table-cell' scope='col'>Created at</th>
                        <th class='d-none d-md-table-cell' scope='col'>Closed at</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="event in filteredList" @click="goToEvent(event.id)">
                        <td>{{event.title}}</td>
                        <td>{{event.description}}</td>
                        <td class=''>{{event.owner.firstName}} {{event.owner.lastName}}</td>
                        <td class='d-none d-md-table-cell'>{{event.created}}</td>
                        <td class='d-none d-md-table-cell'>{{event.closed}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                debts: [],
                search: '',

            };
        },
        methods: {
            goToDebt(id) {
                router.push('/debts/' + id);
            },
            getDebts() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('debts/user/' + user.id)
                        .then((data) => {
                            self.debts = data.data;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },
        computed: {
            filteredList() {
                return this.debts.filter((debt) => {
                    return event.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.description.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.owner.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.owner.lastName.toLowerCase().includes(this.search.toLowerCase());
                });
            },
        },
    };
</script>

<style scoped>
    .header {
        padding-top: 30px
    }

    .search-wrapper {
        margin: 30px 30px 30px 0;
    }

    .form-control {
        width: 300px !important;
    }
</style>