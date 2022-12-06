
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { IResponse } from './response';

@Injectable()
export class TokenService extends DataService<IResponse> {
  constructor(
      protected override httpClient: HttpClient,
  ) {
      super(httpClient, 'environment.apiURL.oauth');
  }
}
