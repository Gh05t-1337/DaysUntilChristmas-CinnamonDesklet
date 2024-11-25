const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Settings = imports.ui.settings;
const Lang = imports.lang;
const Mainloop = imports.mainloop;

function ChristmasDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}


ChristmasDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);
        
        this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
        this.settings.bindProperty(Settings.BindingDirection.IN, "type", "type", this.on_setting_changed);  //bind settings from settings-schema.json

        this.setupUI();
    },

    setupUI: function() {
        // main container for the desklet

        // calc days until christmas ---------
        let today = new Date();
        let christmasYear = today.getFullYear();

        if (today.getMonth() == 11 && today.getDate() > this.type) {
          christmasYear = christmasYear + 1;
        }

        let christmasDate = new Date(christmasYear, 11, this.type);
        let dayMilliseconds = 1000 * 60 * 60 * 24;

        let remainingDays = Math.ceil(
          (christmasDate.getTime() - today.getTime()) /
           (dayMilliseconds)
        );
        // ----------------------------------

        this.window = new St.Bin();
        this.text = new St.Label();
        this.text.style = "font-size: 30px;color:yellow;"
	    this.text.set_text("🎅️ Days until Christmas: "+remainingDays+" 🎄️");
        
        this.window.add_actor(this.text);
        this.setContent(this.window);


        this.timeout = Mainloop.timeout_add_seconds(30, Lang.bind(this, this.setupUI)); // initiate main loop (runs setupUI every 30 seconds)
    },
    
    on_setting_changed: function() {
        // settings changed; instant refresh
        Mainloop.source_remove(this.timeout); // so it doesn't just start an aditional mainloop
        this.setupUI();
    },

    on_desklet_removed: function() {
        Mainloop.source_remove(this.timeout); // making sure it stops looping
    }
}

function main(metadata, desklet_id) {
    return new ChristmasDesklet(metadata, desklet_id);
}
