const { execSync } = require("child_process");
const { readFileSync, createWriteStream, createReadStream } = require('fs');
const { resolve } = require("path");
const nunjucks = require('nunjucks');

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

function buildExtension(cfg) {
	console.log("Build extension")
	const path = resolve(process.cwd(), `${cfg.outDir}/${cfg.name}.sef`);
	const stream = createWriteStream(path);

	//Write Name
	stream.write("[extension_name]\r\n");
	stream.write(cfg.name + "\r\n");

	//Write Description
	stream.write("[extension_info]\r\n");
	if (cfg.description) stream.write(cfg.description + "\r\n");

	//Write version
	stream.write("[extension_version]\r\n");
	stream.write(cfg.version + "\r\n");

	//Write bridge panel
	stream.write("[insert_external]\r\n");
	if (cfg.panel) {
		// console.log("render",);
		stream.write(nunjucks.render(cfg.panel, cfg));
		// stream.write(readFileSync(cfg.panel));
	}

	//Write commands
	stream.write("[insert_command]\r\n");
	if (cfg.command) stream.write(readFileSync(cfg.command));


	//Write hooks
	stream.write("[insert_hook]\r\n");

	//Write script
	stream.write("[insert_script]\r\n");
	if (cfg.script) stream.write(readFileSync(cfg.script));

	//Write deck panel
	stream.write("[insert_over]\r\n");
	if (cfg.deck) stream.write(readFileSync(cfg.deck));

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
	}, package, cfg);

	buildExtension(buildOptions)
}

main();
