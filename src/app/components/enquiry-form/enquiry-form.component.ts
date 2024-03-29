import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';

declare var $: any;


@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.css'
})
export class EnquiryFormComponent {

  products: any = [];
  keyword: string = '';
  stateList: any;
  cityList: any;
  selectedStateCities: any = [];
  fileUrl: string = environment.fileUploadUrl;
  repEnquiryProductData: any;


  constructor(private router: Router, public apiService: ApiService) {
    console.log("response logged")
    this.repEnquiryProductData = null;
    this.getCityStates();
    // this.repEnquiryProductData = this.apiService.enquiryProductData;
    // console.log(this.repEnquiryProductData, 'repEnquiryProductData');


    this.apiService.enquiryProductData$.subscribe((data) => {
      console.log('enquiryProductData$:----- ' + JSON.stringify(data));
      this.repEnquiryProductData = data;

      //do whatever else you want to do when the interestingString changes
    });
  }

  sendEnquiry(formData: any) {
    console.log(formData, 'form data');

    this.apiService.postMethod(formData, 'leads').subscribe({
      next: (v) => {
        console.log(v);

        $('#enquiry').trigger('reset');
        this.apiService.showHideModal(
          'visible',
          'Enquiry has been sent successfully, we will contact you soon',
          'success',
          6000
        );
      },
      error: (e) => {
        console.error(e);
        if (e?.error) {
          // this.showError = e.error.message;
        }
      },
      complete: () => console.info('complete'),
    });
  }


  // getCityList() {
  //   this.apiService.getMethod('city-list').subscribe({
  //     next: (v) => {
  //       this.cities = v;
  //       console.log('in city list api function', v);
  //       let cityArray: any = [];

  //       for (const city in this.cities) {
  //         let cityData = this.cities[city];
  //         cityArray = cityArray.concat(cityData);
  //       }
  //       console.log(cityArray);
  //     },
  //     error: (e) => {
  //       console.error(e, 'error');
  //     },
  //     complete: () => console.info('complete'),
  //   });
  // }

  // getStateList() {
  //   this.apiService.getMethod('state-list').subscribe({
  //     next: (v) => {
  //       this.states = v;
  //       console.log('in state list api function', v);
  //       let StateArray: any = [];

  //       for (const state in this.states) {
  //         let stateData = this.states[state];
  //         StateArray = StateArray.concat(stateData);
  //       }
  //       console.log("state", StateArray);

  //     },
  //     error: (e) => {
  //       console.error(e, 'error');
  //     },
  //     complete: () => console.info('complete'),
  //   });
  // }


  getCityStates() {
    this.apiService.getMethod('state-list').subscribe({
      next: (data) => {
        console.log("State : ", data)
        if (data) {
          this.stateList = data;
        }
        this.apiService.getMethod('city-list').subscribe({
          next: (data) => {
            console.log("City : ", data)
            if (data) {
              this.cityList = data;
            }
          },
          error: (e) => {
            console.error(e)
          }
        })
      },
      error: (e) => {
        console.error(e)
      }
    })
  }


  handleStateChange(value: any) {
    // let selectedStateKey = value.value;
    // console.log("State Key : ", selectedStateKey)
    // let selectedState = this.stateList.find((state: { key: any; }) => state.key === selectedStateKey);
    // let selectedStateName = selectedState.name;
    // console.log("State Name : ", selectedStateName);
    this.selectedStateCities = this.cityList[value.value]
    // console.log("Selected State Cities : ", this.selectedStateCities);
  }


}
