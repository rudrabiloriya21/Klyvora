import React from 'react';
import {
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export default function RightInspector({
  project,
  selectedSectionId,
  onClose,
  onUpdateSectionProps,
  onApplyAiPrompt,
}) {
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const section = (homePage?.sections || []).find((s) => s.id === selectedSectionId);

  if (!section) {
    return (
      <aside className="studio-right-inspector empty-inspector" role="complementary">
        <div className="empty-inspector-content">
          <Sliders size={32} className="text-muted" />
          <h4 className="font-display">Select an Element</h4>
          <p className="empty-inspector-text">
            Click on any section in the canvas or the Left Sidebar to inspect and customize its
            content, typography, and controls.
          </p>
        </div>
      </aside>
    );
  }

  const p = section.props || {};

  const handlePropChange = (key, value) => {
    onUpdateSectionProps(section.id, { [key]: value });
  };

  const handleItemChange = (itemsKey, index, field, value) => {
    const list = [...(p[itemsKey] || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      handlePropChange(itemsKey, list);
    }
  };

  const handleAddItem = (itemsKey, defaultItem) => {
    const list = [...(p[itemsKey] || [])];
    list.push(defaultItem);
    handlePropChange(itemsKey, list);
  };

  const handleRemoveItem = (itemsKey, index) => {
    const list = [...(p[itemsKey] || [])];
    list.splice(index, 1);
    handlePropChange(itemsKey, list);
  };

  return (
    <aside className="studio-right-inspector" role="complementary" aria-label="Section Inspector">
      {/* Header */}
      <div className="inspector-header">
        <div className="inspector-title-wrap">
          <span className="inspector-type-pill font-mono">{section.type}</span>
          <h3 className="inspector-title font-display">{section.name || section.type}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inspector-close-btn"
          aria-label="Close Inspector"
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick AI Suggestions Bar */}
      <div className="inspector-ai-bar">
        <span className="font-mono ai-hint-text">
          <Sparkles size={12} className="text-cyan" /> QUICK AI POLISH
        </span>
        <div className="ai-chips-row">
          <button
            type="button"
            onClick={() =>
              onApplyAiPrompt(
                `Make the copy of the ${section.name || section.type} section more luxury and cinematic.`
              )
            }
            className="ai-chip-btn"
          >
            Luxury Tone
          </button>
          <button
            type="button"
            onClick={() =>
              onApplyAiPrompt(
                `Make the headline and description of the ${section.name || section.type} section more punchy and concise.`
              )
            }
            className="ai-chip-btn"
          >
            Concise Copy
          </button>
        </div>
      </div>

      {/* Inspector Body Fields */}
      <div className="inspector-body-scroll">
        {/* Badge / Subtitle */}
        {p.badge !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">BADGE / PILL LABEL</label>
            <input
              type="text"
              value={p.badge || ''}
              onChange={(e) => handlePropChange('badge', e.target.value)}
              className="form-input"
              placeholder="e.g. SPECIAL OFFER"
            />
          </div>
        )}

        {/* Heading */}
        {p.heading !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">MAIN HEADING</label>
            <textarea
              rows="2"
              value={p.heading || ''}
              onChange={(e) => handlePropChange('heading', e.target.value)}
              className="form-input font-display"
              placeholder="Primary section headline"
            />
          </div>
        )}

        {/* Subheading / Subtitle */}
        {p.subheading !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">SUBHEADING / SUPPORTING TEXT</label>
            <textarea
              rows="3"
              value={p.subheading || ''}
              onChange={(e) => handlePropChange('subheading', e.target.value)}
              className="form-input"
              placeholder="Supporting description..."
            />
          </div>
        )}

        {/* Paragraphs for About Section */}
        {p.paragraph1 !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">STORY PARAGRAPH 1</label>
            <textarea
              rows="3"
              value={p.paragraph1 || ''}
              onChange={(e) => handlePropChange('paragraph1', e.target.value)}
              className="form-input"
            />
          </div>
        )}

        {p.paragraph2 !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">STORY PARAGRAPH 2</label>
            <textarea
              rows="3"
              value={p.paragraph2 || ''}
              onChange={(e) => handlePropChange('paragraph2', e.target.value)}
              className="form-input"
            />
          </div>
        )}

        {/* Buttons / Calls to Action */}
        {p.primaryBtnText !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">PRIMARY BUTTON TEXT</label>
            <input
              type="text"
              value={p.primaryBtnText || ''}
              onChange={(e) => handlePropChange('primaryBtnText', e.target.value)}
              className="form-input"
            />
          </div>
        )}

        {p.primaryBtnUrl !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">PRIMARY BUTTON TARGET URL</label>
            <input
              type="text"
              value={p.primaryBtnUrl || ''}
              onChange={(e) => handlePropChange('primaryBtnUrl', e.target.value)}
              className="form-input font-mono"
            />
          </div>
        )}

        {p.secondaryBtnText !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">SECONDARY BUTTON TEXT</label>
            <input
              type="text"
              value={p.secondaryBtnText || ''}
              onChange={(e) => handlePropChange('secondaryBtnText', e.target.value)}
              className="form-input"
            />
          </div>
        )}

        {p.secondaryBtnUrl !== undefined && (
          <div className="form-group">
            <label className="form-label font-mono">SECONDARY BUTTON TARGET URL</label>
            <input
              type="text"
              value={p.secondaryBtnUrl || ''}
              onChange={(e) => handlePropChange('secondaryBtnUrl', e.target.value)}
              className="form-input font-mono"
            />
          </div>
        )}

        {/* Dynamic Items (Products, Services, FAQs, Features, Testimonials) */}
        {p.items && Array.isArray(p.items) && (
          <div className="inspector-items-editor">
            <div className="items-editor-header">
              <span className="form-label font-mono">
                {section.type.toUpperCase()} ITEMS ({p.items.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  handleAddItem('items', {
                    name: 'New Offering',
                    title: 'New Offering',
                    price: '$10.00',
                    desc: 'Quality handcrafted item.',
                    q: 'New Question?',
                    a: 'Helpful answer here.',
                  })
                }
                className="add-sub-item-btn font-mono"
              >
                <Plus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="inspector-subitems-list">
              {p.items.map((item, idx) => (
                <div key={idx} className="inspector-subitem-box glass-card">
                  <div className="subitem-box-header">
                    <span className="font-mono subitem-idx">#0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('items', idx)}
                      className="subitem-remove-btn"
                      title="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Name / Title */}
                  {(item.name !== undefined || item.title !== undefined) && (
                    <input
                      type="text"
                      value={item.name || item.title || ''}
                      onChange={(e) =>
                        handleItemChange('items', idx, item.name !== undefined ? 'name' : 'title', e.target.value)
                      }
                      placeholder="Title / Name"
                      className="form-input subitem-input"
                    />
                  )}

                  {/* Price */}
                  {item.price !== undefined && (
                    <input
                      type="text"
                      value={item.price || ''}
                      onChange={(e) => handleItemChange('items', idx, 'price', e.target.value)}
                      placeholder="$0.00"
                      className="form-input subitem-input font-mono"
                    />
                  )}

                  {/* FAQ Q & A */}
                  {item.q !== undefined && (
                    <input
                      type="text"
                      value={item.q || ''}
                      onChange={(e) => handleItemChange('items', idx, 'q', e.target.value)}
                      placeholder="Question"
                      className="form-input subitem-input"
                    />
                  )}

                  {item.a !== undefined && (
                    <textarea
                      rows="2"
                      value={item.a || ''}
                      onChange={(e) => handleItemChange('items', idx, 'a', e.target.value)}
                      placeholder="Answer"
                      className="form-input subitem-input"
                    />
                  )}

                  {/* Description / Caption */}
                  {item.desc !== undefined && (
                    <textarea
                      rows="2"
                      value={item.desc || ''}
                      onChange={(e) => handleItemChange('items', idx, 'desc', e.target.value)}
                      placeholder="Description"
                      className="form-input subitem-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
