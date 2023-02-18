type Box = [
	boxName: string,
	boxType: number,
	defaultValue: any,
	sizeModifier?: number,
	selectOptions?: string[]
]
interface Boxes {
	[boxVariable: string]: Box
}

declare const SAMMI: {
	/**
	 * Get a variable from SAMMI
	 * @param {string} name - name of the variable
	 * @param {string} buttonId - button ID for local variable, default = global variable
	 */
	getVariable(name?: string, buttonId?: string): Promise<string>;

	/**
	 * Set a variable in SAMMI
	 * @param {string} name - name of the variable
	 * @param {(string|number|object|array|null)} value - new value of the variable
	 * @param {string} buttonId - button ID for local variable, default = global variable
	 */
	setVariable(name?: string, value?: string, buttonId?: string): Promise<string>;

	/**
	 * Send a popup message to SAMMI
	 * @param {string} msg - message to send
	 */
	popUp(msg?: string): Promise<string>;
	/**
	 * Send a yellow notification message to SAMMI
	 * @param {string} msg - message to send
	 */
	alert(msg?: string): Promise<string>;

	/**
	 * send extension command to SAMMI
	 * @param {string} name - name of the extension command
	 * @param {number|string} color - box color, accepts hex/dec colors (include # for hex), default 3355443
	 * @param {number} height - height of the box in pixels, 52 for regular or 80 for resizable box, default 52
	 * @param {Object} boxes
	 * - one object per box, key = boxVariable, value = array of box params
	 * - boxVariable = variable to save the box value under
	 * - boxName = name of the box shown in the user interface
	 * - boxType = type of the box, 0 = resizable, 2 = checkbox (true/false), 14 = regular box, 15 = variable box, 18 = select box, see extension guide for more
	 * - defaultValue = default value of the variable
	 * - (optional) sizeModifier = horizontal box size, 1 is normal
	 * - (optional) [] selectOptions = array of options for the user to select (when using Select box type)
	 * @param {[boxName: string, boxType: number, defaultValue: (string | number), sizeModifier: (number|undefined), selectOptions: Array|undefined]} boxes.boxVariable
	 * */
	extCommand(name?: string, color?: number | string, height?: number, boxes?: Boxes, triggerButton?: boolean): Promise<string>;

	/**
	 * Close SAMMI Bridge connection to SAMMI Core.
	 */
	close(): Promise<string>;

	/**
	 * Get deck and button updates
	 * @param {boolean} enabled - enable or disable updates
	 */
	stayInformed(enabled: boolean): Promise<string>;

	/**
	 * Request an array of all decks
	 * - Replies with an array ["Deck1 Name","Unique ID",crc32,"Deck2 Name","Unique ID",crc32,...]
	 * - Use crc32 value to verify deck you saved localy is the same
	 */
	getDeckList(): Promise<string>;

	/**
	 * Request a deck params
	 * @param {string} id - Unique deck ID retrieved from getDeckList
	 * - Replies with an object containing a full deck
	 */
	getDeck(id?: number): Promise<string>;

	/**
	 * Get deck status
	 * - Replies with either 0 (deck is disabled) or 1 (deck is enabled)
	 * @param {string} id - Unique deck ID retrieved from getDeckList
	 */
	getDeckStatus(deckID?: number): Promise<string>;

	/**
	 * Change deck status
	 * @param {string} id - Unique deck ID retrieved from getDeckList
	 * @param {int} status - New deck status, 0 = disable, 1 = enable, 2 = toggle
	 */
	changeDeckStatus(deckID?: number, status?: number): Promise<string>;

	/**
	 * Retrieve an image in base64
	 * @param {string} fileName - image file name without the path (image.png)
	 * - Replies with an object containing the Base64 string of the image
	 */
	getImage(fileName?: string): Promise<string>;

	/**
	 * Retrieves CRC32 of a file
	 * @param {string} fileName - file name without the path (image.png)
	 */
	getSum(fileName?: string): Promise<string>;

	/**
	 * Retrieves all currently active buttons
	 * - Replies with an array of button param objects
	 */
	getActiveButtons(): Promise<string>;

	/**
	 * Retrieves params of all linked Twitch accounts
	 */
	getTwitchList(): Promise<string>;

	/**
	 * Sends a trigger
	 * @param {number} type - type of trigger
	 * - trigger types: 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem
	 * 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey
	 * 8 Timer, 9 OBS Trigger, 10 SAMMI Bridge, 11 twitch moderation, 12 extension trigger
	 * @param {object} data - whatever data is required for the trigger, see manual
	 */
	trigger(type?: number, data?: object): Promise<string>;

	/**
	 * Sends a test trigger that will automatically include channel ID for from_channel_id pull value
	 * @param {number} type - type of trigger
	 * - trigger types: 0 Twitch chat, 1 Twitch Sub, 2 Twitch Gift, 3 Twitch redeem
	 * 4 Twitch Raid, 5 Twitch Bits, 6 Twitch Follower, 7 Hotkey
	 * 8 Timer, 9 OBS Trigger, 10 SAMMI Bridge, 11 twitch moderation, 12 extension trigger
	 * @param {object} data - whatever data is required for the trigger, see manual
	 */
	testTrigger(type: number, data: object): Promise<string>;

	/**
	 * Triggers a button
	 * @param {string} id - button ID to trigger
	 */
	triggerButton(id?: string): Promise<string>;

	/**
	 * Releases a button
	 * @param {string} id - button ID to release
	 */
	releaseButton(id?: string): Promise<string>;

	/**
	 * Modifies a button
	 * @param {string} id - button ID to modify
	 * @param {number|undefined} color - decimal button color (BGR)
	 * @param {string|undefined} text - button text
	 * @param {string|undefined} image - button image file name
	 * @param {number|undefined} border - border size, 0-7
	 * - leave parameters empty to reset button back to default values
	 */
	modifyButton(id: string, color?: number, text?: string, image?: string, border?: number): Promise<string>;

	/**
	 * Retrieves all currently modified buttons
	 * - object of button objects that are currently modified
	 */
	getModifiedButtons(): Promise<string>;

	/**
	 * Sends an extension trigger
	 * @param {string} trigger - name of the trigger
	 * @param {object} dats - object containing all trigger pull data
	 */
	triggerExt(trigger?: string, data?: object): Promise<string>;

	/**
	 * Deletes a variable
	 * @param {string} name - name of the variable
	 * @param {string} buttonId - button ID for local variable, default = global variable
	 */
	deleteVariable(name?: string, buttonId?: string): Promise<string>;

	/**
	 * Inserts an array value
	 * @param {string} arrayName - name of the array
	 * @param {number} index - index to insert the new item at
	 * @param {string|number|object|array} value - item value
	 * @param {string} buttonId - button id, default is global
	 */
	insertArray(arrayName?: string, index?: number, value?: string, buttonId?: string): Promise<string>;

	/**
	 * Deletes an array value at specified index
	 * @param {string} arrayName - name of the array
	 * @param {number} index - index of the item to delete
	 * @param {string} buttonId - button id, default is global
	 */
	deleteArray(arrayName?: string, slot?: number, buttonId?: string): Promise<string>;

	/**
	 * Sends a notification (tray icon bubble) message to SAMMI
	 * @param {string} msg - message to show
	 */
	notification(msg?: string): Promise<string>;

	generateMessage(): string;
}
