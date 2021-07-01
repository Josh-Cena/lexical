/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {LinkNode, createLinkNode, isLinkNode} from 'outline/LinkNode';
import {initializeUnitTest, sanitizeHTML} from '../utils';

const editorThemeClasses = Object.freeze({
  text: {
    bold: 'my-bold-class',
    underline: 'my-underline-class',
    strikethrough: 'my-strikethrough-class',
    underlineStrikethrough: 'my-underline-strikethrough-class',
    italic: 'my-italic-class',
    code: 'my-code-class',
    hashtag: 'my-hashtag-class',
    overflowed: 'my-overflowed-class',
  },
  link: 'my-link-class',
});

describe('OutlineLinkNode tests', () => {
  initializeUnitTest((testEnv) => {
    test('LinkNode.constructor', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', '/');
        expect(linkNode.__flags).toBe(0);
        expect(linkNode.__type).toBe('link');
        expect(linkNode.__url).toBe('/');
        expect(linkNode.getTextContent()).toBe('foo');
      });
      expect(() => new LinkNode()).toThrow();
    });

    test('LineBreakNode.clone()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', '/');
        const linkNodeClone = linkNode.clone();
        expect(linkNodeClone).not.toBe(linkNode);
        expect(linkNodeClone).toStrictEqual(linkNode);
      });
    });

    test('LinkNode.getURL()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        expect(linkNode.getURL()).toBe('https://example.com/foo');
      });
    });

    test('LinkNode.setURL()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        expect(linkNode.getURL()).toBe('https://example.com/foo');
        linkNode.setURL('https://example.com/bar');
        expect(linkNode.getURL()).toBe('https://example.com/bar');
      });
    });

    test('LinkNode.createDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        expect(
          sanitizeHTML(linkNode.createDOM(editorThemeClasses).outerHTML),
        ).toBe('<span class="my-link-class"><span>foo</span></span>');
        expect(sanitizeHTML(linkNode.createDOM({}).outerHTML)).toBe(
          '<span><span>foo</span></span>',
        );
      });
    });

    test('LinkNode.updateDOM()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        const domElement = linkNode.createDOM(editorThemeClasses);
        expect(
          sanitizeHTML(linkNode.createDOM(editorThemeClasses).outerHTML),
        ).toBe('<span class="my-link-class"><span>foo</span></span>');
        const newLinkNode = new LinkNode('bar', 'https://example.com/bar');
        const result = newLinkNode.updateDOM(
          linkNode,
          domElement,
          editorThemeClasses,
        );
        expect(result).toBe(false);
        expect(sanitizeHTML(domElement.outerHTML)).toBe(
          '<span class="my-link-class"><span>bar</span></span>',
        );
      });
    });

    test('LinkNode.canInsertTextAtEnd()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        expect(linkNode.canInsertTextAtEnd()).toBe(false);
      });
    });

    test('createLinkNode()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode('foo', 'https://example.com/foo');
        const createdLinkNode = createLinkNode(
          'foo',
          'https://example.com/foo',
        );
        expect(linkNode.__type).toEqual(createdLinkNode.__type);
        expect(linkNode.__flags).toEqual(createdLinkNode.__flags);
        expect(linkNode.__parent).toEqual(createdLinkNode.__parent);
        expect(linkNode.__url).toEqual(createdLinkNode.__url);
        expect(linkNode.__key).not.toEqual(createdLinkNode.__key);
      });
    });

    test('isLinkNode()', async () => {
      const {editor} = testEnv;
      await editor.update(() => {
        const linkNode = new LinkNode();
        expect(isLinkNode(linkNode)).toBe(true);
      });
    });
  });
});