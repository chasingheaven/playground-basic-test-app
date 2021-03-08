import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPatients() {
    return this.httpClient.get(environment.queryURI + '/Patient',
      { headers: this.getHeaders() });
  }
  /**
   * 
   * @param startYear start year for search in yyyy-mm-dd format
   * @param endYear included year for search in yyyy-mm-dd format
   * @returns 
   */
  getPatientsBirthDataBetweenYear(startYear, endYear) {
    return this.httpClient.get(environment.queryURI + `/Patient?birthdate=ge${startYear}-01-01&birthdate=le${endYear}-12-31&_sort=-birthdate`,
      { headers: this.getHeaders() });
  }
  /**
   * 
   * @param name name of the patient
   * @param date  birth date in yyyy-mm-dd format
   * @returns 
   */
  getPatientsByNameAndBirthDate(name: string, date:string) {
    return this.httpClient.get(environment.queryURI + `/Patient?name=${name}&birthdate=${date}&_sort=-birthdate`,
    { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/fhir+json'
    });
    return headers;
  }
}


