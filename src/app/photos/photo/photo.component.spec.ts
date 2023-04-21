import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoComponent } from './photo.component';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PhotoComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render img with provided url', () => {
    component.url = 'test-url-1';

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toContain('test-url-1');
    expect(img?.getAttribute('width')).toBe('300');
    expect(img?.getAttribute('height')).toBe('200');
  });

  it('should render img with provided width and height', () => {
    component.width = 500;
    component.height = 900;

    fixture.detectChanges();


    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://picsum.photos/200/300');
    expect(img?.getAttribute('width')).toBe('500');
    expect(img?.getAttribute('height')).toBe('900');
  });

  it('should render img with provided values', () => {
    component.url = 'test-url-321';
    component.width = 400;
    component.height = 800;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toContain('test-url-321');
    expect(img?.getAttribute('width')).toBe('400');
    expect(img?.getAttribute('height')).toBe('800');
  });
});
