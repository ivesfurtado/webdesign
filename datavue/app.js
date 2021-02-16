axios.defaults.baseURL = "http://127.0.0.1:8000/api";

new Vue({
    el: '#app',
    data: {
        products: [],
        categories: [],

        order: {
           dir: 1,
           column: 'name'
        },

        filters: {
           name: ''
        },

        perPage: 10,
        currentPage: 1,

        product: {
           id: null,
           name: '',
           category_id: '',
           price: ''
        },

        isEdit: false,

        errors: {},

        removedProductId: null
   },

   mounted() {
      this.fetchProducts();
      this.fetchCategories();
      this.setCurrentPage();

      window.onpopstate = () => {
         this.setCurrentPage();
      }
   },

   computed: {
      productsPaginated() {
         let start = (this.currentPage - 1) * this.perPage;
         let end = (this.currentPage * this.perPage);
         return this.productsSorted.slice(start, end);
      },

      productsSorted() {
         return this.productsFiltered.sort((a, b) => {
            let left = a[this.order.column], right = b[this.order.column];
            
            if (isNaN(left) && isNaN(right)) {
               if (left < right) return -1 * this.order.dir;
               else if (left > right) return 1 * this.order.dir;
               else return 0;
            } else {
               return (left - right) * this.order.dir;
            }
         });
      },

      sortType() {
         return this.order.dir == 1 ? 'ascending' : 'descending';
      },

      whenSearching() {
         return this.filters.name.length > 0;
      },

      productsFiltered() {
         let products = this.products;

         if (this.filters.name) {
            let findName = new RegExp(this.filters.name, 'i');
            products = products.filter(e => e.name.match(findName))
         }

         return products;
      },

      isFirstPage() {
         return this.currentPage == 1;
      },

      isLastPage() {
         return this.currentPage >= this.pages;
      },

      pages() {
         return Math.ceil(this.productsFiltered.length / this.perPage);
      },

      modalTitle() {
         return this.isEdit ? "Update Product" : "Add New Product";
      },

      modalTextButton() {
         return this.isEdit ? "Update" : "Save";
      }
   },
   methods: {
      setPushState(event) {
         event.preventDefault();
         const url = event.srcElement.href;
         if (url) {
            history.pushState({}, '', url);
         }
      },

      setCurrentPage() {
         let params = new URLSearchParams(window.location.search.slice(1));
         this.currentPage = params.has('page') ? parseInt(params.get('page')) : 1;
      },

      fetchProducts() {
         axios.get('/products')
               .then(({ data }) => {
                  this.products = data.data;
               });
      },

      fetchCategories() {
         axios.get('/categories')
               .then(({ data }) => {
                  this.categories = data.data;
               });
      },

      remove(product) {
         if (confirm("Are you sure?")) {
            axios.delete('/products/' + product.id)
                  .then(res => {
                     // store the product.id in removedProductId
                     this.removedProductId = product.id;
                     
                     // delay the execution for 1 second
                     // then set the removedProductId back to null to detach
                     // the table-danger class from <tr>
                     // after that remove the tr from UI
                     new Promise(resolve => setTimeout(resolve, 1000))
                           .then(() => {
                              this.removedProductId = null;
                              let index = this.products.findIndex(item => item.id === product.id);
                              this.products.splice(index, 1);
                           })
                     });
            }
      },

      saveOrUpdate() {
         if (this.isEdit) {
            this.update();
         } else {
            this.save();
         }
      },

      update() {
         this.product.price = this.product.price * 100;
  
         axios.put('/products/' + this.product.id, this.product)
            .then(({ data }) => {
               let index = this.products.findIndex(item => item.id === this.product.id);
         
               this.products.splice(index, 1, data.data);
         
               this.isEdit = false;
               
               this.errors = {};
         
               $(this.$refs.vuemodal).modal('hide');
            })
            .catch(({ response }) => {
               this.errors = response.data.errors
            })
      },

      add() {
         this.isEdit = false;

         this.product = {
            id: null,
            name: '',
            category: '',
            price: ''
         };

         $(this.$refs.vuemodal).modal('show');
      },

      edit(product) {
         this.product = Object.assign({}, product);

         this.isEdit = true;

         $(this.$refs.vuemodal).modal('show');
      },

      save() {
         this.product.price = this.product.price * 100;

         axios.post('/products', this.product)
               .then(({ data }) => {
                  this.productsPaginated.unshift(data.data)

                  this.product = {
                     id: null,
                     name: '',
                     category: '',
                     price: ''
                  }

                  this.errors = {};

                  $(this.$refs.vuemodal).modal('hide');
               })
               .catch(({ response }) => {
                  this.errors = response.data.errors;
                  console.log(this.errors)
               });
      },

      switchPage(page, event) {
         this.setPushState(event);
         this.currentPage = page;
      },

      classes(column) {
         return [
            'sort-control',
            column == this.order.column ? this.sortType : ''
         ]
      },

      sort(column) {
         this.order.column = column;
         this.order.dir *= -1;
      },

      clearText() {
         this.filters.name = '';
      },

      prev(event) {
         this.setPushState(event);
         if (!this.isFirstPage) {
            this.currentPage--;
         }
      },

      next(event) {
         this.setPushState(event);
         if (!this.isLastPage) {
            this.currentPage++;
         }
      }
   }
})
