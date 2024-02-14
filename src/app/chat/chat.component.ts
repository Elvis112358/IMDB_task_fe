import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { maxNumOfChars } from '../core/shared/constants/const';
import { convertMbToBytes } from '../core/shared/helper';
// import * as feather from 'feather-icons';

// const messages =  [
//   {
//     "documents": null,
//     "author": {
//       "id": 1,
//       "firstName": "John",
//       "lastName": "Doe"
//     },
//     "question": true,
//     "external": false,
//     "description": "This is a sample comment 1",
//     "createdDate": "2023-09-07T10:30:00"
//   },
//   {
//     "documents": null,
//     "author": {
//       "id": 2,
//       "firstName": "Alice",
//       "lastName": "Smith"
//     },
//     "error": false,
//     "external": true,
//     "description": "This is a sample comment 2",
//     "createdDate": "2023-09-07T11:15:00"
//   },
//   {
//     "documents": null,
//     "auto": true,
//     "author": null,
//     "error": false,
//     "external": false,
//     "description": "This is an automated message",
//     "createdDate": "2023-09-07T12:00:00"
//   },
//   {
//     "documents": [
//       {
//         "id": 1,
//         "documentName": "Sample Document.pdf"
//       }
//     ],
//     "auto": false,
//     "author": {
//       "id": 3,
//       "firstName": "Eva",
//       "lastName": "Johnson"
//     },
//     "question": true,
//     "error": false,
//     "external": false,
//     "description": "This is a comment with a document",
//     "createdDate": "2023-09-07T13:45:00",
//     "uploading": false
//   },
//   {
//     "documents": [
//       {
//         "id": 1,
//         "documentName": "Sample Document.pdf"
//       }
//     ],
//     "auto": false,
//     "author": {
//       "id": 3,
//       "firstName": "Eva",
//       "lastName": "Johnson"
//     },
//     "question": false,
//     "error": false,
//     "external": false,
//     "description": "This is a comment with a document",
//     "createdDate": "2023-09-07T13:45:00",
//     "uploading": false
//   },
//   {
//     "documents": null,
//     "auto": false,
//     "author": {
//       "id": 1,
//       "firstName": "John",
//       "lastName": "Doe"
//     },
//     "error": true,
//     "external": false,
//     "description": "This is a comment with an error",
//     "createdDate": "2023-09-07T14:30:00"
//   }
// ];

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  filteredMessages: any[] = [];
  messagesResponse: any[] = [];
  constructor(
    private formBuilder: FormBuilder // private authenticationService: AuthenticationService,
  ) // private toasterService: ToasterService,
  // private translate: TranslateService
  {}
  chatForm!: FormGroup;
  comment = '';
  // use to disable send and upload input while uploding
  loading = false;
  maxNumOfChars = maxNumOfChars;
  disableButton = false;
  files: any[] = [];
  onlyDocuments: boolean = false;
  @Input() messages: any[] = []
  @Input() disableComments: boolean = false;
  @Input() showAttachDocuments: boolean = true;
  @Input() isClosedStatus: boolean = false;
  @Input() showDocumentsToggle: boolean = true;
  @Input() usedOnComplaints: boolean = false;
  @Output() uploadedFile = new EventEmitter<any>();
  @Output() public commentSubmited = new EventEmitter<{
    comment: string;
  }>();

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToComment();
    this.scrollToBottom();
    this.disableChatForm(this.disableComments);
    if (this.messages) {
      this.filteredMessages = this.filteringDocuments(this.messages);
      this.messagesResponse = this.messages;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['messages']?.isFirstChange()) {
      this.messagesResponse = this.messages;
      this.filteredMessages = this.filteringDocuments(this.messages);
      if (this.onlyDocuments) {
        this.messages = this.filteredMessages;
      }
    }
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }


  filterDocuments(toggleButtonActive: any): void {
    if (toggleButtonActive) {
      this.messages = this.filteredMessages;
    } else {
      this.messages = this.messagesResponse;
    }
  }

  filteringDocuments(messages: any): any[] {
    if (!messages) return [];
    return [...messages.filter((item: any) => item.documents)];
  }

  initializeForm(): void {
    this.chatForm = this.formBuilder.group({
      comment: [''],
      file: null,
    });
  }

  cssCommentsClasses(i: number): string {
    if (this.messages.length - 1 === i && this.messages.length !== 1) {
      return 'last';
    } else if (this.messages.length === 1) {
      return 'only';
    } else if (i === 0) {
      return 'first';
    } else {
      return '';
    }
  }

  cssCommentAlignmentClasses(comment: any): string {
    let appliedCssClasses: string = '';
    if (comment?.question) {
      appliedCssClasses = 'my-message';
    }
    if (comment.auto) {
      appliedCssClasses = appliedCssClasses + ' automated';
    }
    if (comment.error) {
      return `my-message error`;
    }

    if (comment.uploading) {
      return `my-message uploading`;
    } else {
      return appliedCssClasses;
    }
  }

  subscribeToComment(): void {
    this.chatForm.get('comment')?.valueChanges.subscribe((comment) => {
      this.comment = comment;
    });
  }
  disableChatForm(disableComments: boolean): void {
    if (disableComments) {
      this.chatForm.controls['comment'].disable();
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  submit(): void {
    if (this.comment) {
      this.commentSubmited.emit({
        comment: this.comment,
      });
    }
  }

  toggleFilter(filterDoc: any): void {
    this.onlyDocuments = filterDoc;
    this.disableButton = filterDoc;
    this.filterDocuments(filterDoc);
  }

  private validateUploadedFile(file: any) {
    const UPLOAD_FILE_TYPES: string[] = [
      '.pdf',
      '.docx',
      '.doc',
      '.xlsx',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.tif',
      '.raw',
      '.jfif',
    ];

    if (!UPLOAD_FILE_TYPES.some((char) => file.name.endsWith(char))) {
      // this.showErrorToaster('lbl-only-pdf-word');
      window.alert('lbl-only-pdf-word');
      return;
    }
    if (file.size > convertMbToBytes(20)) {
      // this.showErrorToaster('lbl-file-too-large');
      window.alert('lbl-file-too-large');
      return;
    }
    if (file.size === 0) {
      // this.showErrorToaster('lbl-file-empty');
      window.alert('lbl-file-empty');
      return;
    }
    if (file.size > convertMbToBytes(1)) {
      // this.showErrorToaster('lbl-file-exceedes-size');
      window.alert('lbl-file-exceedes-size');
      return;
    }
    this.files.push(file);
  }

  fileBrowseHandler(files: FileList | null): void {
    this.files = [];

    if (files) this.validateUploadedFile(files[0]);
    if (this.files.length) {
      this.uploadedFile.emit(this.files[0]);

      //just to add placeholder messages while file is being uploaded
      //TO DO
      // implement this in parent component and remove from chat component
      this.messages.push({ uploading: true, documents: true, question: true });
      console.log('this.messages', this.messages);
      console.log('files', files);
    }
  }

  showErrorToaster(message: string, fileName: string = ''): void {
    let title = '';
    let msg = '';

    window.alert(message);

    // this.translate.get('error-title').subscribe((res: string) => {
    //   title = res;
    // });

    // this.translate.get(message).subscribe((s: string) => {
    //   msg = s;
    // });

    // this.toasterService.showError(title, msg);
  }
}
