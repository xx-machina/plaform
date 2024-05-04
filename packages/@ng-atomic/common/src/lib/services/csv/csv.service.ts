import { Injectable } from '@angular/core';
import { unparse } from 'papaparse';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  downloadArrayAsCsv(array: Record<string, string>[], fileName: string = `${dayjs().format()}.csv`) {
    const UTF_8_BOM = '%EF%BB%BF';
    const data = 'data:text/csv;charset=utf-8,' + UTF_8_BOM + encodeURIComponent(unparse(array));
    const element = document.createElement('a');
    element.href = data;
    element.setAttribute('download', fileName);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
