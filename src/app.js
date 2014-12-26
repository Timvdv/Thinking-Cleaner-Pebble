/**
 * Thinking Cleaner Pebble App!
 * made by Tim van de Vathorst
 * www.timvandevathorst.nl
 */

var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card(
{
  title: 'Searching...',
  body: 'Looking for your Thinking Cleaner device...'
});

main.show();

ajax(
    {
        url: 'http://tc.thinkingsync.com/api/v1/discover/devices',
        type: 'json',
    },
    function(data)
    {   
        var roomba = data[0];
        init(roomba);
    },
    function(error)
    {
        var epic_errors = new UI.Card(
        {
            title:'Failed!',
            subtitle:'Cannot connect with the Thinking Cleaner'
        });

        epic_errors.show();
    }
);

function init(roomba)
{
    main.hide();
    
    var roomba_ip = roomba.local_ip,
        roomba_name = roomba.name;
    
    var main_menu = new UI.Menu(
    {
      sections: [{
        title: roomba_name,
        items: [
            {
              title: 'Clean'
            },
            {
              title: 'Dock'
            }
        ]
      }]
    });
    
    main_menu.on('select', function(e)
    {
        var loading_cart = new UI.Card({
            title:'Loading..'
        });
        
        //Start the clean command
        if(e.itemIndex === 0)
        {
            loading_cart.show();
            
            ajax(
                {
                    url: 'http://'+roomba_ip+'/command.json?command=clean&'  + new Date().getTime(),
                    type: 'json',
                    method: 'post',
                },
                function(data)
                {
                    loading_cart.hide();
                },
                function(error) {
                    var card2 = new UI.Card({
                        title:'Failed!',
                        subtitle:'failed... error: '+error
                    });
        
                    card2.show();
                }    
            );  
        }
        
        //Start the dock command
        if(e.itemIndex === 1)
        {
            loading_cart.show();
            
            ajax(
                {
                    url: 'http://'+roomba_ip+'/command.json?command=dock&'  + new Date().getTime(),
                    type: 'json',
                    method: 'post',
                },
                function(data)
                {
                    loading_cart.hide();
                },
                function(error) {
                    var card2 = new UI.Card({
                        title:'Failed!',
                        subtitle:'failed... error: '+error
                    });
        
                    card2.show();
                }
            );
        }
     });
    
     main_menu.show();
}