<template>
    <div>
        <navbar/>
        <background>
            <spinner :loaded="loaded">
                <div class='d-table my-0 mx-auto pt-4'>
                    <b-row class='ml-0'>
                        <h2>Add contact</h2>
                        <font-awesome-icon id="info" icon='info-circle' class='ml-1'></font-awesome-icon>
                        <b-tooltip target="info"
                                   title="Create an Event by giving it an informative title and contacts, then add your contacts to it."
                                   placement="bottom">
                        </b-tooltip>
                    </b-row>
                    <b-row class='pt-4'>
                        <b-col sm='12' md='6'>
                            <autocomplete id='search ' v-model='contact' :placeholder='"Name"' :field='field'
                                          class="w-100"
                                          :items='availableContacts' :required='true'
                                          :key-extractor='getUserFullName'>
                            </autocomplete>
                        </b-col>
                        <b-col class='pt-3 pt-md-0'>
                            <button type='button' v-on:click='sendRequest' class='btn btn-primary wide'>
                                Add contact
                            </button>
                        </b-col>
                    </b-row>
                </div>
                <b-row class='mt-5'>
                    <b-col md='6'>
                        <b-list-group>
                            <h2>Requests</h2>
                            <div v-if='requests && requests.length > 0' class="shadow rounded">
                                <b-list-group-item v-for='person in requests' :key="person.id">
                                    {{getUserFullName(person)}}
                                    <span v-if='person.type === "Incoming"'>
                                    <font-awesome-icon icon='check'
                                                       class='limegreen ml-1 icons float-right fa-shadow-hover'
                                                       v-on:click='acceptContact(person.id)'/>
                                    <font-awesome-icon icon='times'
                                                       class='text-danger icons float-right fa-shadow-hover'
                                                       v-on:click='deleteContact(person.id, user.id)'/>
                                </span>
                                    <div v-else></div>
                                </b-list-group-item>
                            </div>
                            <div v-else class='mt-3'>
                                <p class="h5">No requests right now</p>
                            </div>
                        </b-list-group>

                    </b-col>
                    <b-col md='6' class="mt-3 mt-md-0">
                        <b-list-group>
                            <h2>My contacts</h2>
                            <div v-if="userContacts && userContacts.length > 0" class="shadow rounded">
                                <b-list-group-item v-for='contact in userContacts' :key="contact.id">
                                    <span v-if="isUserTo(contact)">{{getUserFullName(contact.from)}}</span>
                                    <span v-else>{{getUserFullName(contact.to)}}</span>
                                    <font-awesome-icon icon='times'
                                                       class='text-danger icons float-right fa-shadow-hover'
                                                       v-on:click='deleteContact(contact.from.id, contact.to.id)'/>
                                </b-list-group-item>
                            </div>
                            <div v-else class='mt-3'>
                                <p class="h6">No contacts yet, add contacts from search</p>
                            </div>
                        </b-list-group>
                    </b-col>
                </b-row>
            </spinner>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import Autocomplete from '@/components/Autocomplete.vue';
    import userStore from '@/stores/UserStore.ts';
    import Spinner from '@/components/Spinner.vue';
    import contactStore from "@/stores/ContactStore.ts";

    export default {
        name: 'Contacts',
        components: {Navbar, Background, Autocomplete, Spinner},
        data: () => ({
            contact: {},
            field: {value: ''},
            availableContacts: null,
            requests: null,
            userContacts: [],
            user: {},
        }),
        async mounted() {
            this.user = await userStore.getUser();
            this.refreshAllContactsAndRequests();
        },
        computed: {
            loaded() {
                return !!this.requests && !!this.availableContacts;
            },
        },
        methods: {
            refreshAllContactsAndRequests() {
                this.getPersonContacts();
                this.getRequests();
                this.getAvailableContacts();
            },
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            isUserTo(contact) {
                return this.user != null && contact != null && this.user.id === contact.to.id;
            },
            getAvailableContacts() {
                contactStore.getAvailableContacts(this.user.id).onChange((contacts) => {
                    this.availableContacts = contacts;
                });
            },
            getRequests() {
                contactStore.getIncomingAndOutGoingRequests(this.user.id).onChange((incomingRequests, outgoingRequests) => {
                    this.requests = incomingRequests.concat(outgoingRequests);
                });
            },
            getPersonContacts() {
                contactStore.getPersonContacts(this.user.id).onChange((contacts) => {
                    this.userContacts = contacts;
                });
            },

            async sendRequest() {
                if (this.contact && this.contact.id) {
                    await this.$http.post('/contacts/add/' + this.user.id + '/' + this.contact.id);
                    this.field.value = '';
                    this.getAvailableContacts();
                    this.getRequests();
                }
            },
            async acceptContact(id) {
                await this.$http.post('/contacts/accept/' + this.user.id + "/" + id);
                this.getPersonContacts();
                this.getRequests();
            },
            async deleteContact(fromId, toId) {
                await this.$http.delete('/contacts/remove/' + fromId + '/' + toId);
                this.refreshAllContactsAndRequests();
            },
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen;
    }

    .icons {
        width: 22px !important;
        height: 22px !important;
    }
</style>
