var express = require('express'); 
var app = express(); 
var models = require('express-cassandra');
var myIndex = function () {
    init();
};
function init(){
    models.setDirectory( __dirname + '/models').bind(
        {
            clientOptions: {
                contactPoints: ['127.0.0.1'],
                localDataCenter: 'datacenter1',
                protocolOptions: { port: 9042 },
                keyspace: 'declaration',
            },
            ormOptions: {
                defaultReplicationStrategy : {
                    class: 'NetworkTopologyStrategy',
                    'datacenter1' : 3,
                },
                migration: 'safe'
            }
        },
        function(err) {
            if(err) throw err;
            
            // You'll now have a `person` table in cassandra created against the model
            // schema you've defined earlier and you can now access the model instance
            // in `models.instance.Person` object containing supported orm operations.
        }
    );
    

}


    // http://express-cassandra.readthedocs.io/en/latest/batch/
        
    
    module.exports = new myIndex();