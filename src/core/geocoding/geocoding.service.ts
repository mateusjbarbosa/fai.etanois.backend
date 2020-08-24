import { IAddress } from './geocoding.module';
import { Client, Status, GeocodeRequest, GeocodeResponse, LatLngLiteral }
  from "@googlemaps/google-maps-services-js";
import { to } from '../util/util';
import Configuration from '../../config/config';

class Geocoding {
  public async adrressToLatLngLiteral(street_number: any, street: string, neighborhood: string,
    city: string, state: string): Promise<LatLngLiteral> {
    if (typeof street_number == 'number') {
      street_number = street_number.toString();
    } else if (typeof street_number != 'string') {
      throw new Error('Street number is invalid')
    }

    const client = new Client();
    const address: IAddress = { street_number, street, neighborhood, city, state };
    const keys = Object.keys(address);
    let geocode_request: GeocodeRequest;
    let address_map: string = '';

    keys.forEach((key, index) => {
      if (!address[key] && (typeof address[key] === 'string')) {
        throw new Error('Address is invalid')
      } else {
        address[key].replace(/ /g, '+')
        address_map += address[key];

        if (index < (keys.length - 1)) {
          address_map += ','
        }
      }
    });

    geocode_request.params.address = address_map;
    geocode_request.params.key = Configuration.api_maps.key;

    const [err, success] = await to<GeocodeResponse>(client.geocode(geocode_request));

    if (err) {
      console.log('Err API google maps: ' + err);
      throw new Error('Error API google maps request');
    }

    if (success) {
      const status = success.data.status;

      if (status == Status.OK) {
        const result = success.data.results;

        if (result[0]) {
          return result[0].geometry.location;
        } else {
          throw new Error('No results found in geocoder API');
        }
      }
    } else {
      throw new Error('Error geocoder: ' + status);
    }
  }
}

export default new Geocoding();
