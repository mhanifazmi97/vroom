import { Component } from '@angular/core';

import { GlobalVars } from './../providers/globalVars';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(public globalVars: GlobalVars) {
    }

}
