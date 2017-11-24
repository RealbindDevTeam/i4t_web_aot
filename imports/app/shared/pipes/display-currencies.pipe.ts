import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'displayCurrency'
})
export class DisplayCurrenciesPipe implements PipeTransform {
    transform(_value: any): any[] {
        let keyArr: any[] = Object.keys(_value)
        let dataArr = [];

        keyArr.forEach((key: any) => {  
            if(_value[key]){
                dataArr.push(key);
            }                   
        });

        return dataArr;
    }
}