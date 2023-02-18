const { execSync } = require("child_process");
const { readFileSync, createWriteStream, createReadStream } = require('fs');
const { resolve } = require("path");

function exec(cmd) {
	return execSync(cmd, [], {
		stdio: 'pipe'
	});
}

function execTypescript(project) {
	console.log(`Compile "${project}"`)
	try {
		const out = exec(`tsc -p "${project}/tsconfig.json"`);
		console.log(out.toString())
		console.log(`"${project}" compiled`);
		return true;
	} catch (e) {
		console.log(e.stdout.toString());
		return false;
	}
}

function buildTypescript(typescriptFiles) {
	let success = true;

	if (typescriptFiles.script)
		success = execTypescript(typescriptFiles.script)

	if (success && typescriptFiles.command)
		success = execTypescript(typescriptFiles.command)

	return success;
}

function buildExtension({
	name,
	description,
	version,
	deck,
	script,
	command,
	panel,
	outDir
}) {
	console.log("Build extension")
	const path = resolve(process.cwd(), `${outDir}/${name}.sef`);
	const stream = createWriteStream(path);

	//Write Name
	stream.write("[extension_name]\r\n");
	stream.write(name + "\r\n");

	//Write Description
	stream.write("[extension_info]\r\n");
	if (description) stream.write(description + "\r\n");

	//Write version
	stream.write("[extension_version]\r\n");
	stream.write(version + "\r\n");

	//Write bridge panel
	stream.write("[insert_external]\r\n");
	if (panel) stream.write(readFileSync(panel));

	//Write commands
	stream.write("[insert_command]\r\n");
	if (command) stream.write(readFileSync(command));


	//Write hooks
	stream.write("[insert_hook]\r\n");

	//Write script
	stream.write("[insert_script]\r\n");
	if (script) stream.write(readFileSync(script));

	//Write deck panel
	stream.write("[insert_over]\r\n");
	if (deck) stream.write(readFileSync(deck));

	stream.end();
	console.log(`Extension builded: "${path}"`);
}

function main() {
	const cfg = JSON.parse(readFileSync("builder.json", "utf-8"));
	const package = JSON.parse(readFileSync("package.json", "utf-8"));
	let success = true;

	if (cfg.typescript)
		success = buildTypescript(cfg.typescript);

	if (!success) return;
	const buildOptions = Object.assign({
		name: "SAMMI Extension",
		version: "0.0.1",
	}, {
		version: package.version,
		description: package.description,
		name: package.name,
	}, cfg);

	buildExtension(buildOptions)
}

main();
