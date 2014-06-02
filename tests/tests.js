
test("storing data locally", function(){
    var storage = new CopyPasteStorage();
    storage.set('foo', 'bar');
    equal(storage.get('foo'), 'bar');
    deepEqual(storage.get(), {"foo": "bar"});
});

test("access undefined keys and default values", function(){
    var storage = new CopyPasteStorage();
    equal(storage.get('foo'), null);
    equal(storage.get('foo', 'bar'), 'bar');
    storage.set('foo', 'xxx');
    equal(storage.get('foo', 'bar'), 'xxx');
});

asyncTest("save", function(){
    expect(2);
    var storage = new CopyPasteStorage();
    storage.set('foo', 'bar');
    storage.save(function(status) {
        equal(status, true);
        start();
    }, function() {
        // this callback is called after the dialog is opened
        // it is an optional parameter which in normal usage you shouldn't use
        equal($('#CopyPasteStorageDialog textarea').val(), '-- CopyPasteStorage Data - do not modify this line and anything after it --{"foo":"bar"}-- End of CopyPasteStorage Data --');
        $('button.ui-button-text-only').click()
    });
});

asyncTest("load", function(){
    var storage = new CopyPasteStorage();
    storage.load(function(status) {
        equal(status, true);
        equal(storage.get('foo'), 'bar');
        start();
    }, function() {
        // this callback is called after the dialog is opened
        // it is an optional parameter which in normal usage you shouldn't use
        $('#CopyPasteStorageDialog textarea').val('{"foo":"bar"}');
        $('button.ui-button-text-only').click();
    });
});

asyncTest("load - bad data", function(){
    expect(2);
    var alertMsg = '';
    window.alert = function(msg) {
        alertMsg = msg;
    };
    var storage = new CopyPasteStorage();
    storage.load(function(status) {
        equal(status, false);
        equal(alertMsg, 'invalid data');
        start();
    }, function() {
        // this callback is called after the dialog is opened
        // it is an optional parameter which in normal usage you shouldn't use
        $('#CopyPasteStorageDialog textarea').val('{123');
        $('button.ui-button-text-only').click();
    });
});

asyncTest("load - with prefix", function(){
    var storage = new CopyPasteStorage();
    storage.load(function(status) {
        equal(status, true);
        equal(storage.get('foo'), 'bar');
        start();
    }, function() {
        // this callback is called after the dialog is opened
        // it is an optional parameter which in normal usage you shouldn't use
        $('#CopyPasteStorageDialog textarea').val('BLAHBLAHBLAH -- CopyPasteStorage Data - do not modify this line and anything after it --{"foo":"bar"}-- End of CopyPasteStorage Data --');
        $('button.ui-button-text-only').click();
    });
});
