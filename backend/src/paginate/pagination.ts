import { PaginationResultInterface } from './pagination.results.interface';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public page_total: number;
  public total: number;
  public next: string;
  public previous: string;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.results = paginationResults.results;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.page_total = paginationResults.results.length;
    this.total = paginationResults.total;
    this.next = paginationResults.next;
    this.previous = paginationResults.previous;
  }
}
