import Ember from 'ember';

export default Ember.Component.extend({
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
            this.set('sortAscending', !this.get('sortAscending'));

            this.sendAction('onSortPropertyChanged', property);
            this.sendAction('onSortAscendingChanged', this.get('sortAscending'));
        },

        toggleColumnVisibility: function (columnName, columnIndex) {
            columnIndex = columnIndex+2;
            var column = this.$("table tr th:nth-child("+columnIndex+"), table tr td:nth-child("+columnIndex+")");
            if (column.is(":visible")) {
                column.hide();
            } else {
                column.show();
            }
        }
    }
});
