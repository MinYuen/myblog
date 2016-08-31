/**
 * Created by zhangyang on 6/7/16.
 */

/* blog home page blog content view */

define([
    'underscore',
    'backbone',
    'loading',
    'javascript/collection/article-collection',
    'javascript/view/body/content/article-list'
], function (_, Backbone, Loading, ArticleCollection, ArticleListView) {

    'use strict';

    var content = Backbone.View.extend({

        tagName: 'div',

        className: 'blog-content-div',

        initialize: function () {
            this.articles = [];
            this.loading = new Loading(this.el);
            this.collection = new ArticleCollection();
            this.collection.fetch({reset: true, wait: true});
            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'error', this.error);
            this.loading.showLoading();
        },

        render: function () {
            this.addAll();
            return this;
        },

        addOne: function (article) {
            var articleView = new ArticleListView({model: article});
            this.articles.push(articleView);
            this.$el.append(articleView.render().$el);
        },

        addAll: function () {
            //delete has exists article view
            _.forEach(this.articles, function (article) {
                if (article && article instanceof Backbone.View) {
                    article.remove();
                }
            });

            this.articles.length = 0;
            this.collection.each(this.addOne, this);
            if (this.collection.length === 0) {
                this.$el.html('<div class="tip">楼主很懒,暂无文章</div>')
            }
        },

        search: function (value) {
            this.collection.fetch({
                wait: true,
                reset: true,
                data: {'search': value}
            });
        },

        error: function () {
            this.loading.showError();
        },

        reset: function () {
            this.addAll();
            this.loading.hideLoading();
        }

    });

    return content;

});