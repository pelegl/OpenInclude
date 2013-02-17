#Node.js backend for OpenInclude


###ElasticSearch installation for Ubuntu 12.04
 https://gist.github.com/wingdspur/2026107
 
 After installing edit the config /usr/local/share/elasticsearch/bin/service/elasticsearch.conf
 
 set.default.ES_HOME=/usr/local/share/elasticsearch
 set.default.ES_HEAP_SIZE=512

 Mongo should be configured for using a replica set

 MongoDB plugin installation:
  %ES_HOME%/bin/plugin -install elasticsearch/elasticsearch-mapper-attachments/1.6.0
  %ES_HOME%/bin/plugin.bat -url https://github.com/downloads/richardwilly98/elasticsearch-river-mongodb/elasticsearch-river-mongodb-1.6.1.zip -install river-mongodb


 Start indexation by running the following command
 
 
    curl -XPUT "localhost:9200/_river/mongodb/_meta" -d '
	{
	  "type": "mongodb",
	  "mongodb": { 	    	    	    
	    "db": "github_languages", 
	    "collection": "language_names"	    
	  }, 
	  "index": { 
	    "name": "mongolang", 	    
	    "type": "language"
	  }
	}'
	
	curl -XPUT "localhost:9200/_river/mongodb2/_meta" -d '
	{
	  "type": "mongodb",
	  "mongodb": { 	    	    	    
	    "db": "github_modules", 
	    "collection": "modules"	    
	  }, 
	  "index": { 
	    "name": "mongomodules", 	    
	    "type": "module"
	  }
	}'
	
	Test:	
	curl -XGET 'http://localhost:9200/mongolang/_search?pretty=true&size=5000' -d '
	{                     
	    "query" : {                         
	        "matchAll" : {} 
	    } 
	}'
	