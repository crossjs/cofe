import { CofeSchema, CofeTree } from '@cofe/types';
import { extractDefaults, makeId } from '@cofe/utils';
import { u } from 'unist-builder';

export class Schema {
  static isTemplate(schema: CofeSchema) {
    return schema.hasOwnProperty('template');
  }

  static isAccepted(accept: string[], type: string) {
    if (!accept?.length) {
      return false;
    }

    return accept.some((r) => {
      if (r === '*') {
        return true;
      }

      if (r[0] === '!') {
        return r.slice(1) !== type;
      }

      return r === type;
    });
  }

  static createCompositeNode(
    { type, properties, children }: CofeSchema,
    schemas?: Record<string, CofeSchema>,
  ): CofeTree {
    const atomicNode = Schema.createAtomicNode(schemas[type]);

    // @todo actions and events
    if (properties) {
      Object.assign(atomicNode.properties, properties);
    }

    if (children) {
      atomicNode.children = children?.map((c) =>
        Schema.createCompositeNode(c, schemas),
      );
    }

    return atomicNode;
  }

  static createAtomicNode({ type, properties }: CofeSchema): CofeTree {
    const props = {
      id: makeId(),
    };

    // @todo actions and events
    if (properties) {
      Object.assign(props, { properties: extractDefaults(properties) });
    }

    return u(type, props);
  }

  static createNode(schema: CofeSchema, schemas?: Record<string, CofeSchema>) {
    if (Schema.isTemplate(schema)) {
      return Schema.createCompositeNode(schema.template, schemas);
    }

    return Schema.createAtomicNode(schema);
  }
}
