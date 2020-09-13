export enum EServiceType {
  MECHANISM = 'mechanical',
  CAR_WASH = 'car_wash',
  RESTAURANT = 'restaurant',
  CONVENIENCE_STORE = 'convenience_store',
  TIRE_REPAIR_SHOP = 'tire_repair_shop'
}

export function getAllAvaliableService(): string[] {
  return Object.keys(EServiceType).map(key => {
    return EServiceType[key]
  });
}

export interface IAvailableService {
  id?: number;
  service_type: EServiceType;
  fuel_station_id: number;
  time_to_open: string;
  time_to_close: string;
  service_24_hours: boolean;
}

export interface IAvailableServiceDetail {
  service_type: EServiceType;
  fuel_station_id: number;
  time_to_open: string;
  time_to_close: string;
  service_24_hours: boolean;
}

export function createAvailableService(available_service: any): IAvailableServiceDetail {
  const {service_type, fuel_station_id, time_to_open, time_to_close, service_24_hours} = 
    available_service;

  return {service_type, fuel_station_id, time_to_open, time_to_close, service_24_hours};
}

export function createManyAvailableServices(available_services: any[]): IAvailableServiceDetail[] {
  return available_services.map(createAvailableService);
}