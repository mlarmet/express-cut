TYPE_ROUTE_PATH = "./src/route"
TYPES_ROUTES = ["GET", "POST", "PUT", "DELETE"]

OUTPUT_PATH = "./"
OUTPUT_FILE = "snippets.json"

snippetsJson = """{
	"typeRouteGet": {
		"key": "type route get",
		"prefix": "rget",
		"body": [
			%%contentGET%%
		],
		"description": "Creates a type route post for express router",
		"scope": "typescript,javascript"
	},
	"typeRoutePost": {
		"key": "type route post",
		"prefix": "rpost",
		"body": [
			%%contentPOST%%
		],
		"description": "Creates a type route post for express router",
		"scope": "typescript,javascript"
	},
	"typeRoutePut": {
		"key": "type route put",
		"prefix": "rput",
		"body": [
			%%contentPUT%%
		],
		"description": "Creates a type route put for express router",
		"scope": "typescript,javascript"
	},
	"typeRouteDelete": {
		"key": "type route delete",
		"prefix": "rdel",
		"body": [
			%%contentDELETE%%	
		],
		"description": "Creates a type route delete for express router",
		"scope": "typescript,javascript"
	}
}"""

for type in TYPES_ROUTES:
    typeContent = ''
    with open(TYPE_ROUTE_PATH + "/" + type + ".js", 'r') as f:
        for line in f:
            typeContent += "\t\t\t\"" + line.rstrip() \
                                            .replace("\"", "'") \
                                            .replace("\t", "    ") + "\",\n"
    snippetsJson = snippetsJson.replace(
        "%%content" + type + "%%", typeContent + '\t\t\t\""')

with open(OUTPUT_PATH + OUTPUT_FILE, 'w') as f:
    f.write(snippetsJson)
