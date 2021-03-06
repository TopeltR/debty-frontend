<!--Taken from https://alligator.io/vuejs/vue-autocomplete-component/-->
<script>
    export default {
        name: 'Autocomplete',

        props: {
            keyExtractor: {
                type: Function,
                required: true,
                default: () => (object) => {
                    return object;
                },
            },
            items: {
                type: Array,
                required: false,
                default: () => [],
            },
            isAsync: {
                type: Boolean,
                required: false,
                default: false,
            },
            placeholder: {
                type: String,
                required: false,
                default: '',
            },
            field: {
                type: Object,
                required: false,
                default: () => ({value: ''}),
            },
            required: {
                type: Boolean,
                required: false,
                default: false,
            },
        },

        data() {
            return {
                isOpen: false,
                results: [],
                selected: {},
                isLoading: false,
                arrowCounter: 0,
            };
        },

        methods: {
            onChange() {
                this.$emit('input', null);

                // Is the data given by an outside ajax request?
                if (this.isAsync) {
                    this.isLoading = true;
                } else {
                    // Let's  our flat array
                    this.filterResults();
                    this.isOpen = true;
                }
            },
            filterResults() {
                // First uncapitalize all the things
                this.results = this.items.filter((item) => {
                    return this.keyExtractor(item).toLowerCase().indexOf(this.field.value.toLowerCase()) > -1;
                });
            },
            setResult(result) {
                this.selected = result;
                this.field.value = this.keyExtractor(result);
                this.$emit('input', result);
                this.isOpen = false;
            },
            onArrowDown(evt) {
                if (this.arrowCounter < this.results.length) {
                    this.arrowCounter = this.arrowCounter + 1;
                }
            },
            onArrowUp() {
                if (this.arrowCounter > 0) {
                    this.arrowCounter = this.arrowCounter - 1;
                }
            },
            onEnter() {
                const result = this.results[this.arrowCounter];
                if (result) {
                    this.setResult(result);
                    this.arrowCounter = -1;
                }
            },
            handleClickOutside(evt) {
                if (!this.$el.contains(evt.target)) {
                    this.isOpen = false;
                    this.arrowCounter = -1;
                }
            },
        },
        watch: {
            items(val, oldValue) {
                // actually compare them
                if (val.length !== oldValue.length) {
                    this.results = val;
                    this.isLoading = false;
                }
            },
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside);
        },
    };
</script>

<template>
    <div class='autocomplete'>
        <input
                type='text'
                :placeholder='placeholder'
                class='form-control'
                @input='onChange'
                :required="required"
                v-model='field.value'
                @keydown.down='onArrowDown'
                @keydown.up='onArrowUp'
                @keydown.enter='onEnter'
                maxlength="255"
        />
        <ul
                id='autocomplete-results'
                v-show='isOpen'
                class='autocomplete-results'
        >
            <li
                    class='loading'
                    v-if='isLoading'
            >
                Loading results...
            </li>
            <li
                    v-else
                    v-for='(result, i) in results'
                    :key='i'
                    @click='setResult(result)'
                    class='autocomplete-result'
                    :class="{ 'is-active': i === arrowCounter }"
            >
                {{ keyExtractor(result) }}
            </li>
        </ul>
    </div>
</template>

<style scoped lang='scss'>
    .autocomplete {
        position: relative;
    }

    .autocomplete-results {
        padding: 0;
        margin: 0;
        border: 1px solid lightgray;
        border-radius: 0 0 5px 5px;
        height: auto;
        overflow: auto;
        width: 100%;
        background-color: white;
    }

    .autocomplete-result {
        list-style: none;
        text-align: left;
        padding: 4px 2px 4px 10px;
        cursor: pointer;
    }

    .autocomplete-result.is-active,
    .autocomplete-result:hover {
        background-color: dodgerblue;
        color: white;
    }

</style>
