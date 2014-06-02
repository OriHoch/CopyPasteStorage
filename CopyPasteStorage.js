
function CopyPasteStorage()
{
    this._data = {};
}

CopyPasteStorage.prototype = {

    'get': function(key, default_value)
    {
        if (typeof(key) == 'undefined') {
            return this._data;
        } else {
            if (typeof(default_value) == 'undefined') default_value = null;
            return typeof(this._data[key]) == 'undefined' ? default_value : this._data[key];
        }
    },

    'set': function(key, val)
    {
        this._data[key] = val;
    },

    'save': function(closeCallback, openCallback)
    {
        var status = false;
        if ($('#CopyPasteStorageDialog').length == 0) {
            $('body').append('<div id="CopyPasteStorageDialog"/>');
        }
        $('#CopyPasteStorageDialog')
            .attr('title', 'CopyPasteStorage | save')
            .html(
                $('<div/>')
                    .html('This application uses the CopyPasteStorage library to store the data.<br/>It lets you decide where and how to store the data, just copy and paste it somewhere safe for retrieval later.<br/><br/>')
                    .append(
                        $('<textarea/>')
                            .text('-- CopyPasteStorage Data - do not modify this line and anything after it --'+JSON.stringify(this._data)+'-- End of CopyPasteStorage Data --')
                            .css('width', '100%')
                    )
            )
            .dialog({
                'width': $(window).width() * 0.8,
                'maxHeight': $(window).height() * 0.8,
                'buttons': [
                    {
                        'text': "OK, I copied the text and saved it somewhere safe",
                        'click': function() {
                            status = true;
                            $(this).dialog('close');
                        }
                    }
                ],
                'close': function() {
                    closeCallback(status);
                },
                'open': function(){
                    $(this).find('textarea').select();
                    if (typeof(openCallback) != 'undefined') {
                        openCallback();
                    }
                }
            });
    },

    'load': function(closeCallback, openCallback)
    {
        var storage = this;
        var status = false;
        if ($('#CopyPasteStorageDialog').length == 0) {
            $('body').append('<div id="CopyPasteStorageDialog"/>');
        }
        $('#CopyPasteStorageDialog')
            .attr('title', 'CopyPasteStorage | load')
            .html(
                $('<div/>')
                    .html('Paste the data you stored previously.<br/><br/>')
                    .append($('<textarea/>').css('width', '100%'))
            )
            .dialog({
                'width': $(window).width() * 0.8,
                'maxHeight': $(window).height() * 0.8,
                'buttons': [
                    {
                        'text': "OK, I pasted the data, you can load it",
                        'click': function() {
                            try {
                                var data = $(this).find('textarea').val();
                                var tmp = data.split('-- CopyPasteStorage Data - do not modify this line and anything after it --');
                                if (tmp.length == 2) {
                                    data = tmp[1];
                                    tmp = data.split('-- End of CopyPasteStorage Data --');
                                    if (tmp.length == 2) {
                                        data = tmp[0];
                                    }
                                }
                                storage._data = JSON.parse(data);
                                status = true;
                            } catch (e) {
                                alert('invalid data');
                            };
                            $(this).dialog('close');
                        }
                    }
                ],
                'close': function() {
                    closeCallback(status);
                },
                'open': function(){
                    if (typeof(openCallback) != 'undefined') {
                        openCallback();
                    }
                }
            });
    }

};
