import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

interface TreeNode {
  id: string;
  label: string;
  parent?: TreeNode;
  children?: TreeNode[];
  clickable?: boolean;
}

@Component({
  selector: 'cadmus-thesaurus-tree',
  templateUrl: './thesaurus-tree.component.html',
  styleUrls: ['./thesaurus-tree.component.css'],
})
export class ThesaurusTreeComponent implements OnInit {
  @Input()
  public entries: ThesaurusEntry[];
  @Input()
  public rootLabel: string;
  @Output()
  public entryChange: EventEmitter<ThesaurusEntry>;

  public root: TreeNode;
  public treeControl: NestedTreeControl<TreeNode>;
  public treeDataSource: MatTreeNestedDataSource<TreeNode>;

  public filter: FormControl;
  public form: FormGroup;
  public foundNodes: TreeNode[];

  public hasChildren = (index: number, node: TreeNode) => {
    return node && node.children && node.children.length > 0;
  };

  public isRoot = (index: number, node: TreeNode) => {
    return node && node.id === '@root';
  };

  constructor(formBuilder: FormBuilder) {
    // tree
    this.entryChange = new EventEmitter<ThesaurusEntry>();
    this.entries = [];
    this.foundNodes = [];
    this.rootLabel = '-';
    this.root = { id: '@root', label: '-', children: [] };
    this.treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
    this.treeDataSource = new MatTreeNestedDataSource<TreeNode>();
    // filter
    this.filter = formBuilder.control(null);
    this.form = formBuilder.group({
      filter: this.filter,
    });
  }

  ngOnInit(): void {
    this.root = this.buildTreeModel(this.entries);
    this.treeDataSource.data = [this.root];
    // https://github.com/angular/components/issues/12469
    this.treeControl.dataNodes = this.treeDataSource.data;
  }

  private addNode(
    entry: ThesaurusEntry,
    separator: string,
    root: TreeNode
  ): void {
    const components = entry.id.split(separator);

    // walk the tree up to the last existing component
    let i = 0;
    let node = root;
    const idParts: string[] = [];

    // for each component:
    while (i < components.length) {
      idParts.push(components[i]);

      // stop walking when the node has no more children
      if (!node.children) {
        break;
      }
      // find target among children
      const targetId = idParts.join(separator);
      const existing = node.children.find((c) => {
        return c.id === targetId;
      });
      if (existing) {
        node = existing;
        i++;
      } else {
        break;
      }
    }

    // node is now the last existing component; use it as the ancestor
    // for all the remaining components (starting from i)
    while (i < components.length) {
      if (!node.children) {
        node.children = [];
      }
      const isLast = i + 1 === components.length;
      const child: TreeNode = {
        label: isLast ? entry.value : components[i],
        id: isLast ? entry.id : idParts.join(separator),
        parent: node,
        children: [],
      };
      node.children.push(child);
      node = child;
      i++;
    }
  }

  /**
   * Build a tree model from a list of name=value pairs,
   * where each value can include one or more components separated by
   * the specified separator.
   * @param entries The entries to add.
   * @param separator string The separator string to use for values.
   */
  public buildTreeModel(entries: ThesaurusEntry[], separator = '.'): TreeNode {
    const root: TreeNode = {
      id: '@root',
      label: this.rootLabel || '-',
    };
    if (!entries) {
      return root;
    }
    entries.forEach((entry) => {
      this.addNode(entry, separator, root);
    });
    return root;
  }

  public onTreeNodeClick(node: TreeNode): void {
    if (node.children && node.children.length > 0) {
      return;
    }
    this.entryChange.emit({
      id: node.id,
      value: node.label,
    });
  }

  public expandAll(): void {
    this.treeControl.expandAll();
  }

  public collapseAll(): void {
    this.treeControl.collapseAll();
  }

  private expandFromNode(node: TreeNode): void {
    while (node.parent) {
      node = node.parent;
      this.treeControl.expand(node);
    }
  }

  private expandMatchingNodes(
    node: TreeNode,
    filter: string,
    found: TreeNode[]
  ): void {
    if (node.label.toLowerCase().includes(filter)) {
      found.push(node);
      this.expandFromNode(node);
    }
    if (node.children?.length) {
      node.children.forEach((child) => {
        this.expandMatchingNodes(child, filter, found);
      });
    }
  }

  public find(): void {
    if (!this.filter.value?.length) {
      return;
    }
    this.treeControl.collapseAll();
    const foundNodes: TreeNode[] = [];
    this.expandMatchingNodes(
      this.treeDataSource.data[0],
      this.filter.value.toLowerCase(),
      foundNodes
    );
    this.foundNodes = foundNodes;
  }

  public resetFilter(): void {
    this.filter.reset();
    this.foundNodes = [];
  }

  public isFoundNode(node: TreeNode): boolean {
    return this.foundNodes?.length > 0 && this.foundNodes.indexOf(node) > -1;
  }
}
