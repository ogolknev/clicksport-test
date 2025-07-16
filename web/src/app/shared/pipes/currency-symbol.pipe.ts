import { Pipe, PipeTransform } from "@angular/core";

const currencyMap: Record<string, string> = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
};


@Pipe({name: "currencySymbol"})
export class CurrencySymbolPipe implements PipeTransform {
  transform(code: string) {
    return currencyMap[code]
  }
}
