import { Component } from '@angular/core';
import { OtherService } from './Services/other.service';
import { Report, itemData, TreeData } from '../../Models/Report.model';
import { ReportService } from '../reports/Services/Report.service';
import { group } from '@angular/animations';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrl: './other.component.css'
})
export class OtherComponent {
  listChildChanged = [];
  treeviewModals="none";
  treeempName:string="";
  //arr=[];

  treeData: TreeData[] = [];
  arr = [
    {
      id: "group_1",
      name: "Group 1",
      items: this.treeData
    }
  ];
  itemsd = ['item 1', 'item 2', 'item 3'];
  currentCustomer = 'Maria';
  title: string = "werwerw";
  checkdata: boolean = false;
  arrs = [1, , 3, 4, 5];
  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.reportService.GetReportMapping().subscribe({
      next: (data: TreeData[]) => {
        for (const address of data) {
          this.arr[0].items.push(address);
        }
        this.treeData = data;
        this.arr[0].items = JSON.parse(JSON.stringify(this.treeData));
      },
      error: (error: any) => {
        console.error('error fetching data:', error);
        //this.commonService.errorlog(error);
      }
    })
  }

  openModal(item:any){
    this.treeempName=item.empName;
    this.treeviewModals="block";
  }

  treeViewClose(){
    this.treeviewModals="none";
  }
  checkMinusSquare(item: any) {
    // let words: string[] = ["apple", "banana", "cherry", "date"];
    // this.arr.filter(x=>x.items.filter(x=>x.checked == true)).length
    // let filteredWords: string[] = words.filter((word) => word.length > 5);
    [item.childTrees].map((val: itemData, index: number) => {
      if (val.checked == true) {
        this.checkdata = true;
      }
    });

    return this.checkdata;

    // const count = item.childs.filter(x => x.checked == true).length;
    // if (count > 0 && count < item.childs.length) {
    //   return true;
    // } else if (count == 0) {
    //   return false;
    // }
  }
  checkParent(group_i: number, i: number) {
    this.arr[group_i].items[i].checkedItem = !this.arr[group_i].items[i].checkedItem;
    if (this.arr[group_i].items[i].checkedItem) {
      this.arr[group_i].items[i].childTrees.map(x => (x.checkedchild = true));
    } else {
      this.arr[group_i].items[i].childTrees.map(x => (x.checkedchild = false));
    }
    this.arr[group_i].items[i].childTrees.forEach(x => {
      x.childTrees2.map(child2=>child2.checkedchild=this.arr[group_i].items[i].checkedItem)
      // if (this.listChildChanged.findIndex(el => el.id == x.id) == -1) {
      //   this.listChildChanged.push(x);
      // }
    });
  }

  checkParentChild(group_i: number, i: number,j:number) {
    this.arr[group_i].items[i].childTrees[j].checkedchild = !this.arr[group_i].items[i].childTrees[j].checkedchild;
    if (this.arr[group_i].items[i].childTrees[j].checkedchild) {
      this.arr[group_i].items[i].childTrees[j].childTrees2.map(x => (x.checkedchild = true));
    } else {
      this.arr[group_i].items[i].childTrees[j].childTrees2.map(x => (x.checkedchild = false));
    }
    this.arr[group_i].items[i].childTrees.forEach(x => {
      // if (this.listChildChanged.findIndex(el => el.id == x.id) == -1) {
      //   this.listChildChanged.push(x);
      // }
    });
  }

  checkChild(group_i: number, parent_i: number, i: number) {
    this.arr[group_i].items[parent_i].childTrees[i].checkedchild = !this.arr[group_i]
      .items[parent_i].childTrees[i].checkedchild;
    const count = this.arr[group_i].items[parent_i].childTrees.filter(
      el => el.checkedchild == true
    ).length;
    if (count == this.arr[group_i].items[parent_i].childTrees.length) {
      this.arr[group_i].items[parent_i].checkedItem = true;
    } else {
      this.arr[group_i].items[parent_i].checkedItem = false;
    }

    //if all child2 is checked then its parent must be checked 
    const count2 = this.arr[group_i].items[parent_i].childTrees[i].childTrees2.filter(
      el => el.checkedchild == true
    ).length;
    // if (count2 == this.arr[group_i].items[parent_i].childTrees[i].childTrees2.length) {
    //   this.arr[group_i].items[parent_i].childTrees[i].checkedchild = true;
    // } else {
    //   this.arr[group_i].items[parent_i].childTrees[i].checkedchild = false;
    // }

    if (this.arr[group_i].items[parent_i].childTrees[i].checkedchild) {
      this.arr[group_i].items[parent_i].childTrees[i].childTrees2.map(x => (x.checkedchild = true));
    } else {
      this.arr[group_i].items[parent_i].childTrees[i].childTrees2.map(x => (x.checkedchild = false));
    }

   // this.checkParentChild(group_i,parent_i,i);
  }

  checkChild2(group_i: number, parent_i: number, i: number,j:number) {

    this.arr[group_i].items[parent_i].childTrees[i].childTrees2[j].checkedchild = !this.arr[group_i]
      .items[parent_i].childTrees[i].childTrees2[j].checkedchild;
    const count = this.arr[group_i].items[parent_i].childTrees[i].childTrees2.filter(
      el => el.checkedchild == true
    ).length;
    if (count == this.arr[group_i].items[parent_i].childTrees[i].childTrees2.length) {
      this.arr[group_i].items[parent_i].childTrees[i].childTrees2[j].checkedchild = true;
    } else {
      this.arr[group_i].items[parent_i].childTrees[i].childTrees2[j].checkedchild = false;
    }
   
    const count_p = this.arr[group_i].items[parent_i].childTrees.filter(
      el => el.checkedchild == true
    ).length;
    if (count_p == this.arr[group_i].items[parent_i].childTrees.length) {
      this.arr[group_i].items[parent_i].checkedItem = true;
    } else {
      this.arr[group_i].items[parent_i].checkedItem = false;
    }
      this.checkChild(group_i,parent_i,i);
  }

  getListChildChanged() {
    console.log(this.listChildChanged);
  }
}
