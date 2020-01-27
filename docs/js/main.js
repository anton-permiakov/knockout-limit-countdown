ko.extenders.limit = function(target, maxLength) {
    var result = ko.pureComputed({
        read: target,
        write: function(newValue) {
            var current = target();

            if(!newValue){
                newValue = '';
            }

            if(newValue.length > maxLength){
                target.notifySubscribers(current);
            } else {
                target(newValue);
            }
        }
    }).extend({ notify: 'always' });
 
    result(target());
 
    return result;
};

// usage: <input type="text" data-bind="textInput: someObservable, countdown: {data: someObservable, limit: maxLength}">
ko.bindingHandlers.countdown = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var cntSpan = document.createElement('small');
        var parent = element.parentNode;
        var data = ko.unwrap(valueAccessor());
        var computedData = ko.computed(function(){
            return data.data() ? data.limit - data.data().length : data.limit
        })
        cntSpan.classList.add('form-text', 'text-muted', 'text-right');
        parent.insertBefore(cntSpan, element.nextSibling);
        ko.applyBindingsToNode(cntSpan, {text: computedData})
    }
};

function TestViewModel() {
    var self = this;

    self.testValue = ko.observable().extend({limit: 10});
    self.textareaValue = ko.observable().extend({limit: 25});
}