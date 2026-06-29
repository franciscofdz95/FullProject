import { Component, Input } from '@angular/core';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../src/environments/environment';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public date: string = '';
  public browser: string = '';
  public appName: string = '';
  private baseUrl = environment.apiUrl;
  @Input() userName: string = '';
  @Input() userAccount: string = '';

  constructor(private http: HttpClient, private authService: MsalService) { }

  ngOnInit() {
    this.getForecasts();
    this.getBrowservesion();
  }

  redirectToBIA() {
    window.open(environment.biaUrl, '_blank');
  }

  // get the current date 
  getForecasts() {
    var currentdate = new Date(); 
    this.date =
  (currentdate.getMonth() + 1) + "/" +
  currentdate.getDate() + "/" +
  currentdate.getFullYear() + "  " +
  currentdate.getHours().toString().padStart(2, '0') + ":" +
  currentdate.getMinutes().toString().padStart(2, '0');
  }

  getBrowservesion() {
    var objappVersion = navigator.appVersion;
    var browserAgent = navigator.userAgent;
    var browserName = navigator.appName;
    var browserVersion = '' + parseFloat(navigator.appVersion);
    var browserMajorVersion = parseInt(navigator.appVersion, 10);
    var Offset, OffsetVersion, ix;

    // For Chrome  
    if ((OffsetVersion = browserAgent.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      browserVersion = browserAgent.substring(OffsetVersion + 7);
    }

    // For Microsoft internet explorer  
    else if ((OffsetVersion = browserAgent.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      browserVersion = browserAgent.substring(OffsetVersion + 5);
    }

    // For Firefox 
    else if ((OffsetVersion = browserAgent.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
    }

    // For Safari 
    else if ((OffsetVersion = browserAgent.indexOf("Safari")) != -1) {
      browserName = "Safari";
      browserVersion = browserAgent.substring(OffsetVersion + 7);
      if ((OffsetVersion = browserAgent.indexOf("Version")) != -1)
        browserVersion = browserAgent.substring(OffsetVersion + 8);
    }

    // For other browser "name/version" is at the end of userAgent  
    else if ((Offset = browserAgent.lastIndexOf(' ') + 1) <
      (OffsetVersion = browserAgent.lastIndexOf('/'))) {
      browserName = browserAgent.substring(Offset, OffsetVersion);
      browserVersion = browserAgent.substring(OffsetVersion + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }

    // Trimming the fullVersion string at  
    // semicolon/space if present  
    if ((ix = browserVersion.indexOf(";")) != -1)
      browserVersion = browserVersion.substring(0, ix);
    if ((ix = browserVersion.indexOf(" ")) != -1)
      browserVersion = browserVersion.substring(0, ix);


    browserMajorVersion = parseInt('' + browserVersion, 10);
    if (isNaN(browserMajorVersion)) {
      browserVersion = '' + parseFloat(navigator.appVersion);
      browserMajorVersion = parseInt(navigator.appVersion, 10);
    }
    this.browser = browserName + ' ' + browserMajorVersion;
  }


  logout(): void {
    this.authService.logout();
  }

  goHome() {
    document.querySelectorAll('.tab-pane').forEach(el => {
      el.classList.remove('show', 'active');
    });

    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.remove('active');
    });

    const firstPane = document.querySelector('#upload-sfabra-pane');
    if (firstPane) {
      firstPane.classList.add('show', 'active');
    }

    const firstTab = document.querySelector('#upload-sfabra-tab');
    if (firstTab) {
      firstTab.classList.add('active');
    }
  }

  openDocumentation() {
    this.http.get(`${this.baseUrl}/api/documents/download-documentation`, { responseType: 'blob' }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SFABRA Procurement User Directions.docx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
