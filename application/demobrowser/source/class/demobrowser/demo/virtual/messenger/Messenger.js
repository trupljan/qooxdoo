/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   * Fabian Jakobs (fjakobs)
   * Jonathan Weiß (jonathan_rass)

************************************************************************ */

/* ************************************************************************
#asset(qx/icon/${qx.icontheme}/22/emotes/*)
************************************************************************ */

qx.Class.define("demobrowser.demo.virtual.messenger.Messenger",
{
  extend : qx.ui.core.Widget,

  construct : function()
  {
    this.base(arguments);

    this.__amount = 200;

    this.__createUsers();
    
    this.groupPositions = {}
    this.groupPositions[0] = true;
    this.groupPositions[10] = true;

    // Create and fill model
    this.setModel(new qx.data.Array());
    var model = this.getModel();

    for (var i=0; i<this.__users.length; i++)
    {
      var buddyModel = new demobrowser.demo.virtual.messenger.BuddyModel().set({
        name : this.__users[i].name,
        avatar : this.__users[i].img,
        status : this.__users[i].statusIcon
      });

      model.setItem(i, buddyModel);
    }

    // Create widget windo
    var win = new qx.ui.window.Window("Contacts").set({
      contentPadding: 0,
      showClose: false,
      showMinimize: false
    });

    win.setLayout(new qx.ui.layout.Grow());
    win.moveTo(250, 20);
    win.open();
    
    var width = 200;

    // Create scroller
    var scroller = new qx.ui.virtual.core.Scroller(this.__amount, 1, 28, width).set({
      scrollbarX: "off",
      scrollbarY: "auto",
      width: width,
      height: 300
    });

    scroller.getPane().addListener("resize", this._onResize, this);

    // Create layers
    var groupColor = "rgb(60, 97, 226)";
    this.rowLayer = new qx.ui.virtual.layer.Row("white", "rgb(238, 243, 255)");

    for (var row in this.groupPositions) 
    {
      row = parseInt(row);
      scroller.getPane().getRowConfig().setItemSize(row, 15);
      this.rowLayer.setColor(row, groupColor);
    }

    // Add layers to scroller
    scroller.getPane().addLayer(this.rowLayer);
    
    this.cellLayer = new qx.ui.virtual.layer.WidgetCell(this);
    scroller.getPane().addLayer(this.cellLayer);
    win.add(scroller);
    
    this.__groupCell = new demobrowser.demo.virtual.messenger.GroupCell();
    this.__buddyCell = new demobrowser.demo.virtual.messenger.BuddyCell();
    
    this.manager = new qx.ui.virtual.selection.Row(scroller.getPane(), this);  
    this.manager.attachMouseEvents();
    this.manager.attachKeyEvents(scroller);        

    this.__scroller = scroller;

    var prefetch = new qx.ui.virtual.behavior.Prefetch(
      scroller,
      0, 0, 0, 0,
      200, 300, 600, 800
    );

    // Create controller
    new demobrowser.demo.virtual.messenger.Controller(this.getModel(), this);
    model.addListener("changeLength", this._modelLengthChange, this);
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {

    model :
    {
      event : "changeModel",
      check : "qx.data.Array"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __users : null,
    __scroller : null,
    __amount : null,

    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     */

    __createUsers : function()
    {
      this.__users = [
        {
          name : "Alexander Back",
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Fabian Jakobs",
          img : "demobrowser/demo/icons/imicons/fabian_jakobs.png",
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Andreas Ecker",
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Martin Wittemann",
          img : "demobrowser/demo/icons/imicons/martin_wittemann.png",
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Thomas Herchenröder",
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Daniel Wagner",
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Jonathan Weiß",
          img : "demobrowser/demo/icons/imicons/jonathan_weiss.png",
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Yücel Beser",
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        },
        {
          name : "Christian Schmidt",
          img : "demobrowser/demo/icons/imicons/christian_schmidt.png",
          statusIcon : this.getRandomStatus()
        }
      ];

      for (var i=0; i<this.__users.length; i++) {
        this.__users[i].group = "qooxdoo";
      };
      
      // Fill with dummy users:
      for (var i=this.__users.length; i<this.__amount; i++) {
        this.__users[i] = {
          name : "User #" + i,
          img : this.getRandomBuddy(),
          statusIcon : this.getRandomStatus()
        };
      }
    },    
      
    getRandomBuddy : function()
    {
      var icons = [
        "angel", "embarrassed", "kiss", "laugh", "plain", "raspberry",
        "sad", "smile-big", "smile", "surprise"
      ];
      return "icon/22/emotes/face-" + icons[Math.floor(Math.random() * icons.length)] + ".png";
    },
  
    getRandomStatus : function()
    {
      var icons = [
        "away", "busy", "online", "offline"
      ];
      return icons[Math.floor(Math.random() * icons.length)];
    },

    getCellWidget : function(row, column)
    {
      var widget;

      if (this.groupPositions[row])
      {
        var label = (row == 0) ? "qooxdoo" : "Friends";
        widget = this.__groupCell.getCellWidget(label);
      }
      else
      {
        var item = this.getModel().getItem(row-1);

        var states = {};
        if (this.manager.isItemSelected(row)) {
          state.selected = true;
        }
        widget = this.__buddyCell.getCellWidget(item, states);
      }

      widget.setUserData("row", row);
      return widget;
    },

    poolCellWidget: function(widget)
    {
      if (this.groupPositions[widget.getUserData("row")]) {
        this.__groupCell.pool(widget);
      } else {      
        this.__buddyCell.pool(widget)
      }
    },

    update : function() {
      this.__scroller.getPane().fullUpdate();
    },  
    
    isItemSelectable : function(row) {
      return (this.groupPositions[row] == undefined);
    },
    
    styleListItem : function(widget, isSelected)
    {
      if (isSelected) {
        widget.setTextColor("text-selected");
      } else {
        widget.resetTextColor();
      }
    },
    
    styleSelectable : function(row, type, wasAdded) 
    {
      if (type !== "selected") {
        return;
      }
      
      if (wasAdded) {
        this.rowLayer.setDecorator(row, "selected");
      } else {
        this.rowLayer.setDecorator(row, null);
      }
      
      var widgets = this.cellLayer.getChildren();
      for (var i=0; i<widgets.length; i++)
      {
        var widget = widgets[i];
        if (row !== widget.getUserData("row")) {
          continue;
        }
        
        if (wasAdded) {
          this.styleListItem(widget, true);
        } else {
          this.styleListItem(widget, false);
        }        
      }      
    },    
    
    _onResize : function(e) {
      this.__scroller.getPane().getColumnConfig().setItemSize(0, e.getData().width);
    },

    _modelLengthChange : function(e)
    {
      this.__amount = e.getTarget().length;
      this.__scroller.getPane().getRowConfig().setItemCount(this.__amount+1);
    }
  }
});