import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CountryService {
  private readonly nagerUrl: string;
  private readonly countriesUrl: string;
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {
    this.nagerUrl = this.configService.get<string>('NAGER_URL');
    this.countriesUrl = this.configService.get<string>('COUNTRIES_NOW_URL');
  }

  async getAvailableCountries() {
    const { data } = await firstValueFrom(
      this.http.get(`${this.nagerUrl}/AvailableCountries`),
    );
    return data;
  }

  async getCountryInfo(countryCode: string) {
    const borders = await firstValueFrom(
      this.http.get(`${this.nagerUrl}/CountryInfo/${countryCode}`),
    );
    const officialName = borders.data.officialName;
    const population = await firstValueFrom(
      this.http.post(`${this.countriesUrl}/population`, {
        country: officialName,
      }),
    );
    const flagUrl = await firstValueFrom(
      this.http.post(`${this.countriesUrl}/flag/images`, {
        country: officialName,
      }),
    );

    return {
      borders: borders.data,
      population: population.data,
      url: flagUrl.data.data.flag,
    };
  }
}
