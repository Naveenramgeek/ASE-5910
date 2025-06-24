import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { adHistoryResolver } from './ad-history.resolver';

describe('adHistoryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => adHistoryResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
