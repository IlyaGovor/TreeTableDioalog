sap.ui.define(
  [
    "sap/ui/model/Filter",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/m/ComboBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/ElementRegistry",
    "sap/ui/core/ComponentRegistry",
  ],
  function (
    Filter,
    SmartFilterBar,
    ComboBox,
    MessageToast,
    Fragment,
    Controller,
    FilterOperator,
    JSONModel,
    syncStyleClass,
    ElementRegistry,
    ComponentRegistry
  ) {
    "use strict";
    let globalFilterValues = [];
    return {
      onCustomAction: function (oEvent) {
        if (!this._pDialog) {
          this._pDialog = this.loadFragment({
            type: "XML",
            // name: "project1.ext.fragments.simpleDialog",
            name: "project1.ext.fragments.TreeTab",
          }).then(function (oDialog) {
            return oDialog;
          });
        }

        this._pDialog.then(
          function (oDialog) {
            oDialog.open();
          }.bind(this)
        );
      },

      onOkDialog: function (oEvent) {
        var oTable = this.byId("treeTable");
        var selectedData = [];
        //get indices of selected rows
        var aIndices = oTable.getSelectedIndices();
        for (var i = 0; i < aIndices.length; i++) {
          //fetch the data of selected rows by index
          var tableContext = oTable.getContextByIndex(aIndices[i]);
          var data = oTable.getModel().getProperty(tableContext.getPath());
          selectedData.push(data);
        }

        if (selectedData.length == 0) {
          globalFilterValues = undefined;
        } else {
          globalFilterValues = selectedData;
        }
        const registeredStuff = ElementRegistry.all(); //check id for UI elements
        function callbackFunction(id) {
            if (id.sId.endsWith("--listReport")){
                mainTabId = id.sId;
               // return id;
            }
          
          }
        var filterredElement = ElementRegistry.filter(callbackFunction);
        var mainTabId;
        // var oMainTab = this.byId(
        //   "project1::sap.suite.ui.generic.template.ListReport.view.ListReport::Nodes--listReport"
        // );
       var oMainTab = this.byId(mainTabId);
       
        oMainTab.rebindTable();
        this.byId("treeTab").close();
      },

      onCloseDialog: function (oEvent) {
        this.byId("treeTab").close();
      },

      getCustomAppStateDataExtension: function (oCustomData) {
        //the content of the custom field will be stored in the app state, so that it can be restored later, for example after a back navigation.
        //The developer has to ensure that the content of the field is stored in the object that is passed to this method.
        if (oCustomData) {
          var oCustomField1 = this.oView.byId("customfilter_id");
          if (oCustomField1) {
            oCustomData.customproperty_name = oCustomField1.getSelectedKey();
          }
        }
      },
      restoreCustomAppStateDataExtension: function (oCustomData) {
        //in order to restore the content of the custom field in the filter bar, for example after a back navigation,
        //an object with the content is handed over to this method. Now the developer has to ensure that the content of the custom filter is set to the control
        if (oCustomData) {
          if (oCustomData.customproperty_name) {
            var oComboBox = this.oView.byId("customfilter_id");
            oComboBox.setSelectedKey(oCustomData.customproperty_name);
          }
        }
      },
      onBeforeRebindTableExtension: function (oEvent) {
        var oBindingParams = oEvent.getParameter("bindingParams");
        oBindingParams.parameters = oBindingParams.parameters || {};
        if (typeof globalFilterValues !== "undefined") {
            globalFilterValues.forEach(v => {
                oBindingParams.filters.push(
                    new Filter("Description", "EQ", v.Description)
                  );

            });
        }
        var oSmartTable = oEvent.getSource();
        var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
        if (oSmartFilterBar instanceof SmartFilterBar) {
          var oCustomControl =
            oSmartFilterBar.getControlByKey("customfilterkey");
          if (oCustomControl instanceof ComboBox) {
            var vCategory = oCustomControl.getSelectedKey();
            switch (vCategory) {
              // case "0" :
              // 	oBindingParams.filters.push(new Filter("Supplier", "EQ", "SAP"));
              // 	break;
            //  case "1":
             //   oBindingParams.filters.push(
             //     new Filter("Description", "EQ", "1")
             //  );
             //   break;
              default:
                break;
            }
          }
        }
      },
    };
  }
);
