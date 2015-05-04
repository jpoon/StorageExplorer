import Ember from 'ember';

export default Ember.Component.extend({
    attributeBindings: ["data-column-index"],
    sortAscending: true,

    glyphiconDirection: function() {
      if (this.get('sortAscending')) {
         return "glyphicon-chevron-down";
      } else {
         return "glyphicon-chevron-up";
      }
    }.property("sortAscending"),


    actions: {
        sortBy: function(property) {
            this.send('columnVisibilityReset');

            this.set('sortAscending', !this.get('sortAscending'));
            this.sendAction('onSortAscendingChanged', this.get('sortAscending'));
            this.sendAction('onSortPropertyChanged', property);
        },

        columnVisibilityToggle: function (columnName, columnIndex) {
            var checkbox = this.$('.column-filter input[data-column-index="'+columnIndex+'"]');
            this.send('columnVisibilitySet', columnIndex+2, !checkbox.is(':checked'));
        },

        columnVisibilityReset: function() {
            var that = this;
            var columnFilters = this.$('.column-filter input:checkbox:not(:checked)');
            columnFilters.each(function(idx, columnFilter) {
                columnFilter = that.$(columnFilter);

                columnFilter.prop('checked', true);
                that.send('columnVisibilitySet', columnFilter.data("columnIndex")+2, false);
            });
        },

        columnVisibilitySet: function(columnIndex, hide) {
            var column = this.$("table tr th:nth-child("+ columnIndex +"), table tr td:nth-child("+ columnIndex +")");
            if (hide) {
                column.hide();
            } else {
                column.show();
            }
        }
    }
});
