var Book = Backbone.Model.extend({
    defaults: {
        chapters: 5,
        current: 1
    },
    //urlRoot: "/books",
    idAttribute: "_id",
    validate: function(attrs){
        if (attrs.published && typeof attrs.published !== 'number'){
            return "`published` should be a number"
        }
    },
    read: function(){
        var curr = this.get("current");
        if(curr < this.get("chapters")){
            this.set("current", curr + 1);
        }
    },
    isFinished: function(){
        return this.get("chapters") === this.get("current");
    }
});

var Books = Backbone.Collection.extend({
    model: Book,
    url: "/books"
});




var BookView = Backbone.View.extend({
    template: _.template( $("#BookViewTemplate").html()),
    tagName: 'li',
    events: {
      "click .remove": "removeModel"
    },
    className: 'book book-item',
    attributes: function(){
        return{
            'data-client-id': this.model.cid
        }
    },
    render: function(){
        this.el.innerHTML = this.template( this.model.toJSON() );
        return this;
    },
    removeModel: function(evt){
        this.model.destroy();
    }
});

var BooksView = Backbone.View.extend({
    initialize: function(){
        this.listenTo( this.collection, 'remove', this.removeBook );
        this.listenTo( this.collection, 'add', this.addBook );

        this.listenTo( this.collection, 'remove', this.updateCounter );
        this.listenTo( this.collection, 'add', this.updateCounter );
    },
    events: {
      "click .nav": 'handleNavClick'
    },
    template: _.template( $("#BooksViewTemplate").html()),
    children: {},
    render: function(){
        this.el.innerHTML = this.template( this.collection );
        this.collection.each( this.addBook.bind(this) );
        return this;
    },
    addBook: function (model){
        this.children[model.cid] = new BookView({model: model});
        this.$('ol').append( this.children[model.cid].render().el );
    },
    removeBook: function (model){
        this.children[model.cid].remove();
    },
    updateCounter: function(){
        this.$("#bookCounter").text( this.collection.length );
    },
    handleNavClick: function(evt){
        Backbone.history.navigate(evt.target.getAttribute('href'), {trigger: true});
        evt.preventDefault();
    }
});

var AddBookView = Backbone.View.extend({
    template: _.template( $("#AddBooksViewTemplate").html() ),
    events:{
        "click .add": 'addNewBook'
    },
    render: function(){
        this.el.innerHTML = this.template();
        return this;
    },
    addNewBook: function(evt){
        this.collection.create({
            title: this.$("#title").val(),
            author: this.$("#author").val()
        });
        // navigate to book list page
        Backbone.history.navigate('', {trigger: true});
    }
});

var MainView = Backbone.View.extend({
    el: "#main"
});

// ROUTER
var BookRouter = Backbone.Router.extend({
    initialize: function(opts) {
        this.myBookCollection = opts.myBooks
    },
    routes: {
        '': 'list',
        'add': 'add'
    },
    list: function() {
        console.log("viewing the book list");
        var booksView = new BooksView( { collection: this.myBookCollection } );
        $("#main").empty().append( booksView.render().el );
    },
    add: function(){
        console.log("viewing the add book form");
        var addBookView = new AddBookView( { collection: this.myBookCollection } );
        $("#main").empty().append( addBookView.render().el );
    }
});

var books = new Books();

books.fetch().then(function () {
    var router = new BookRouter({
        myBooks: books
    });
    Backbone.history.start({ pushState:true });
});



