define([
    'jquery',
    'underscore',
    'knockout',
    'arches',
    'utils/resource',
    'utils/report',
    'views/components/reports/scenes/name',
    'views/components/reports/scenes/json'
], function($, _, ko, arches, resourceUtils, reportUtils) {
    return ko.components.register('application-area-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['tabs', 'activeTabIndex'];
            Object.assign(self, reportUtils);
            self.sections = [
                {id: 'name', title: 'Names and Identifiers'},
                {id: 'description', title: 'Descriptions and Citations'},
                {id: 'location', title: 'Location Data'},
                {id: 'protection', title: 'Designation and Protection Status'},
                {id: 'resources', title: 'Associated Resources'},
                {id: 'audit', title: 'Audit Data'},
                {id: 'json', title: 'JSON'},
            ];
            self.associatedApplicationAreaTableConfig = {
                ...self.defaultTableConfig,
                paging: true,
                searching: true,
                scrollY: "250px",
                columns: Array(2).fill(null)
            }
            self.reportMetadata = ko.observable(params.report?.report_json);
            self.resource = ko.observable(self.reportMetadata()?.resource);
            self.displayname = ko.observable(ko.unwrap(self.reportMetadata)?.displayname);
            self.activeSection = ko.observable('name');
            self.visible = {
                applicationAreas: ko.observable(true)
            }

            self.applicationAreas = ko.observableArray();

            self.nameDataConfig = {
                name: 'application area',
            };

            self.resourceDataConfig = {
                files: 'digital file(s)'
            };

            self.locationDataConfig = {
                location: []
            }

            self.nameCards = {};
            self.auditCards = {};
            self.resourcesCards = {};
            self.descriptionCards = {};
            self.locationCards = {};
            self.protectionCards = {};
            self.summary = params.summary;
            self.cards = {};

            const associatedApplicationAreas = self.getRawNodeValue(self.resource(), 'associated application area');
            if(Array.isArray(associatedApplicationAreas)){
                self.applicationAreas(associatedApplicationAreas.map(x => {
                    const resourceName = self.getNodeValue(x);
                    const tileid = self.getTileId(x);
                    const resourceUrl = self.getResourceLink(self.getRawNodeValue(x));
                    return {resourceName, resourceUrl, tileid};
                }));
            }

            if(params.report.cards){
                const cards = params.report.cards;
                
                self.cards = self.createCardDictionary(cards)

                self.nameCards = {
                    name: self.cards?.['application area names'],
                    externalCrossReferences: self.cards?.['external cross references'],
                    systemReferenceNumbers: self.cards?.['system reference numbers'],
                };

                self.descriptionCards = {
                    descriptions: self.cards?.['descriptions'],
                };
            }

        },
        template: { require: 'text!templates/views/components/reports/application-area.htm' }
    });
});
