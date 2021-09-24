import { Pipe, PipeTransform } from '@angular/core';
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import eoLocale from "date-fns/locale/es";

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return distanceInWordsToNow(new Date(value), {
      addSuffix: true,
      locale: eoLocale
    });
  }
}
